/**
 * Deep Link Service
 *
 * Handles parsing, building, and validating Telegram deep links.
 */

import {
  DeepLinkType,
  type ParsedDeepLink,
  type DeepLinkReferral,
  type DeepLinkParams,
  type DeepLinkBuilderOptions,
  type DeepLinkValidation,
  type CampaignParams,
} from "../types/deep-link.types";

/**
 * Deep link configuration.
 */
export interface DeepLinkConfig {
  botUsername?: string;
  appDomain?: string;
  maxStartParamLength?: number;
}

/**
 * Deep Link Service
 *
 * Handles all deep link operations including:
 * - Parsing deep links from start parameters
 * - Building deep links for sharing
 * - Validating deep link parameters
 * - Extracting referral information
 */
export class DeepLinkService {
  private static instance: DeepLinkService | null = null;
  private botUsername: string;
  private appDomain: string;
  private maxStartParamLength: number;

  private constructor(config: DeepLinkConfig = {}) {
    this.botUsername = config.botUsername ?? "YourBotUsername";
    this.appDomain = config.appDomain ?? "t.me";
    this.maxStartParamLength = config.maxStartParamLength ?? 64;
  }

  /**
   * Get singleton instance.
   */
  static getInstance(config?: DeepLinkConfig): DeepLinkService {
    if (!DeepLinkService.instance) {
      DeepLinkService.instance = new DeepLinkService(config);
    }
    return DeepLinkService.instance;
  }

  /**
   * Reset singleton instance.
   */
  static resetInstance(): void {
    DeepLinkService.instance = null;
  }

  /**
   * Parse a deep link string.
   */
  parseDeepLink(raw: string): ParsedDeepLink {
    if (!raw || raw.trim() === "") {
      return {
        raw: "",
        type: DeepLinkType.UNKNOWN,
        additionalParams: {},
      };
    }

    const trimmed = raw.trim();
    const additionalParams: Record<string, string> = {};

    // Remove leading slash if present
    const cleanParams = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;

    // Parse campaign parameters
    const campaign = this.parseCampaign(cleanParams);

    // Determine deep link type
    const type = this.determineType(cleanParams, campaign);

    // Parse referral if present
    const referral = this.parseReferral(cleanParams);

    // Extract game ID if present
    const gameId = this.extractGameId(cleanParams);

    // Parse additional query params
    if (cleanParams.includes("?")) {
      const [base, query] = cleanParams.split("?");
      const searchParams = new URLSearchParams(query);
      searchParams.forEach((value, key) => {
        if (key !== "start" && key !== "startgroup" && key !== "ref") {
          additionalParams[key] = value;
        }
      });
    }

    return {
      raw: trimmed,
      type,
      campaign: campaign ?? undefined,
      referral,
      gameId,
      additionalParams,
    };
  }

  /**
   * Parse deep link from start parameter.
   */
  parseStartParam(startParam: string | undefined | null): ParsedDeepLink {
    if (!startParam) {
      return {
        raw: "",
        type: DeepLinkType.UNKNOWN,
        additionalParams: {},
      };
    }
    return this.parseDeepLink(decodeURIComponent(startParam));
  }

  /**
   * Build a deep link URL.
   */
  buildDeepLink(options: DeepLinkBuilderOptions): string {
    const params: string[] = [];

    // Handle start parameter
    if (options.startParam) {
      const encodedParam = encodeURIComponent(options.startParam);
      params.push(`start=${encodedParam}`);
    }

    // Handle startgroup
    if (options.startGroup) {
      params.push("startgroup=true");
    }

    // Handle game ID
    if (options.gameId) {
      params.push(`game=${options.gameId}`);
    }

    // Handle referral
    if (options.referralUserId) {
      params.push(`ref=${options.referralUserId}`);
    }

    // Handle campaign parameters
    if (options.campaign) {
      params.push(`utm_source=${encodeURIComponent(options.campaign.source)}`);
      params.push(`utm_medium=${encodeURIComponent(options.campaign.medium)}`);
      params.push(`utm_campaign=${encodeURIComponent(options.campaign.campaign)}`);
      if (options.campaign.term) {
        params.push(`utm_term=${encodeURIComponent(options.campaign.term)}`);
      }
      if (options.campaign.content) {
        params.push(`utm_content=${encodeURIComponent(options.campaign.content)}`);
      }
    }

    const queryString = params.length > 0 ? `?${params.join("&")}` : "";
    return `https://${this.appDomain}/${this.botUsername}${queryString}`;
  }

  /**
   * Build a simple start deep link.
   */
  buildStartLink(startParam?: string): string {
    if (!startParam) {
      return `https://${this.appDomain}/${this.botUsername}`;
    }
    return `https://${this.appDomain}/${this.botUsername}?start=${encodeURIComponent(startParam)}`;
  }

  /**
   * Build a startgroup deep link.
   */
  buildStartGroupLink(startParam?: string): string {
    const base = `https://${this.appDomain}/${this.botUsername}`;
    if (!startParam) {
      return `${base}?startgroup=true`;
    }
    return `${base}?start=${encodeURIComponent(startParam)}&startgroup=true`;
  }

  /**
   * Build a share link with optional deep link.
   */
  buildShareLink(text?: string): string {
    return `https://${this.appDomain}/${this.botUsername}`;
  }

  /**
   * Validate deep link parameters.
   */
  validateDeepLink(params: DeepLinkParams): DeepLinkValidation {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (params.startParam) {
      if (params.startParam.length > this.maxStartParamLength) {
        errors.push(`Start parameter exceeds maximum length of ${this.maxStartParamLength}`);
      }

      if (!this.isValidStartParam(params.startParam)) {
        errors.push("Start parameter contains invalid characters");
      }
    }

    if (params.startParam?.includes(" ")) {
      warnings.push("Start parameter contains spaces - consider encoding");
    }

    if (params.chatType && !["private", "group", "supergroup", "channel"].includes(params.chatType)) {
      errors.push(`Invalid chat type: ${params.chatType}`);
    }

    if (params.authDate) {
      const now = new Date();
      const diff = now.getTime() - params.authDate.getTime();
      const hoursDiff = diff / (1000 * 60 * 60);
      if (hoursDiff > 24) {
        warnings.push("Auth date is more than 24 hours old");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Extract referral information from deep link.
   */
  extractReferral(startParam: string | undefined | null): DeepLinkReferral | undefined {
    if (!startParam) return undefined;

    const parsed = this.parseDeepLink(startParam);
    return parsed.referral;
  }

  /**
   * Extract campaign parameters from deep link.
   */
  extractCampaign(startParam: string | undefined | null): CampaignParams | undefined {
    if (!startParam) return undefined;

    const parsed = this.parseDeepLink(startParam);
    return parsed.campaign;
  }

  /**
   * Check if start parameter is a referral.
   */
  isReferral(startParam: string | undefined | null): boolean {
    if (!startParam) return false;
    const parsed = this.parseDeepLink(startParam);
    return parsed.type === DeepLinkType.REFERRAL;
  }

  /**
   * Check if start parameter is a campaign link.
   */
  isCampaign(startParam: string | undefined | null): boolean {
    if (!startParam) return false;
    const parsed = this.parseDeepLink(startParam);
    return parsed.type === DeepLinkType.CAMPAIGN;
  }

  /**
   * Check if start parameter is a game link.
   */
  isGameLink(startParam: string | undefined | null): boolean {
    if (!startParam) return false;
    const parsed = this.parseDeepLink(startParam);
    return parsed.type === DeepLinkType.GAME;
  }

  /**
   * Parse campaign parameters from string.
   */
  private parseCampaign(params: string): CampaignParams | undefined {
    const campaign: Partial<CampaignParams> = {};
    let hasCampaign = false;

    const utmSourceMatch = params.match(/utm_source=([^&]+)/);
    const utmMediumMatch = params.match(/utm_medium=([^&]+)/);
    const utmCampaignMatch = params.match(/utm_campaign=([^&]+)/);
    const utmTermMatch = params.match(/utm_term=([^&]+)/);
    const utmContentMatch = params.match(/utm_content=([^&]+)/);

    if (utmSourceMatch) {
      campaign.source = decodeURIComponent(utmSourceMatch[1]);
      hasCampaign = true;
    }
    if (utmMediumMatch) {
      campaign.medium = decodeURIComponent(utmMediumMatch[1]);
      hasCampaign = true;
    }
    if (utmCampaignMatch) {
      campaign.campaign = decodeURIComponent(utmCampaignMatch[1]);
      hasCampaign = true;
    }
    if (utmTermMatch) {
      campaign.term = decodeURIComponent(utmTermMatch[1]);
      hasCampaign = true;
    }
    if (utmContentMatch) {
      campaign.content = decodeURIComponent(utmContentMatch[1]);
      hasCampaign = true;
    }

    return hasCampaign ? (campaign as CampaignParams) : undefined;
  }

  /**
   * Determine deep link type.
   */
  private determineType(params: string, campaign?: CampaignParams): DeepLinkType {
    if (params.startsWith("game=") || params.includes("game/")) {
      return DeepLinkType.GAME;
    }

    if (params.includes("ref=") || params.includes("referral=")) {
      return DeepLinkType.REFERRAL;
    }

    if (campaign || params.includes("utm_")) {
      return DeepLinkType.CAMPAIGN;
    }

    if (params.startsWith("start=") || params.startsWith("start ")) {
      return DeepLinkType.START;
    }

    if (params.includes("startgroup")) {
      return DeepLinkType.STARTGROUP;
    }

    return DeepLinkType.UNKNOWN;
  }

  /**
   * Parse referral information.
   */
  private parseReferral(params: string): DeepLinkReferral | undefined {
    const refMatch = params.match(/ref=(\d+)/);
    if (!refMatch) return undefined;

    const userId = parseInt(refMatch[1], 10);

    return {
      userId,
    };
  }

  /**
   * Extract game ID from parameters.
   */
  private extractGameId(params: string): string | undefined {
    const gameMatch = params.match(/game=([^&]+)/);
    if (gameMatch) {
      return decodeURIComponent(gameMatch[1]);
    }
    return undefined;
  }

  /**
   * Validate start parameter format.
   */
  private isValidStartParam(param: string): boolean {
    // Allow alphanumeric, hyphens, underscores
    return /^[a-zA-Z0-9_-]+$/.test(param);
  }
}

/**
 * Get deep link service instance.
 */
export function getDeepLinkService(config?: DeepLinkConfig): DeepLinkService {
  return DeepLinkService.getInstance(config);
}
