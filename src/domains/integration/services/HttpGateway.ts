/**
 * HTTP Gateway
 *
 * Abstract HTTP client for external service communication.
 * Provides a provider-agnostic interface for making HTTP requests.
 *
 * IMPORTANT: This gateway is an ABSTRACTION layer. It does NOT:
 * - Implement provider-specific logic
 * - Include provider SDKs (Telegram, Stripe, OpenAI, etc.)
 * - Handle authentication flows (OAuth, etc.)
 *
 * These belong to future provider-specific modules.
 *
 * The gateway ONLY:
 * - Makes HTTP requests
 * - Handles timeouts
 * - Processes headers
 * - Returns structured responses
 */

import { createLogger } from '../../../core/logging/logger.service';
import type { ILogger } from '../../../shared/types/interfaces';

/**
 * HTTP methods supported by the gateway.
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * HTTP headers representation.
 */
export type HttpHeaders = Record<string, string>;

/**
 * Query parameters representation.
 */
export type QueryParams = Record<string, string | number | boolean | undefined | null>;

/**
 * Request body types.
 */
export type RequestBody = Record<string, unknown> | string | null | undefined;

/**
 * HTTP response structure.
 */
export interface HttpResponse<T = unknown> {
  /** HTTP status code */
  statusCode: number;
  /** Response body */
  body: T;
  /** Response headers */
  headers: HttpHeaders;
  /** Response time in milliseconds */
  responseTimeMs: number;
  /** Whether the request was successful (2xx status) */
  success: boolean;
}

/**
 * HTTP error structure.
 */
export interface HttpError {
  /** Error code */
  code: string;
  /** Error message */
  message: string;
  /** HTTP status code (if applicable) */
  statusCode?: number;
  /** Original error (if any) */
  cause?: Error;
}

/**
 * HTTP request configuration.
 */
export interface HttpRequestConfig {
  /** Request URL */
  url: string;
  /** HTTP method */
  method?: HttpMethod;
  /** Request headers */
  headers?: HttpHeaders;
  /** Query parameters */
  queryParams?: QueryParams;
  /** Request body */
  body?: RequestBody;
  /** Request timeout in milliseconds */
  timeoutMs?: number;
  /** Whether to follow redirects */
  followRedirects?: boolean;
}

/**
 * Gateway interface for HTTP operations.
 */
export interface IHttpGateway {
  /**
   * Makes an HTTP request.
   */
  request<T = unknown>(config: HttpRequestConfig): Promise<HttpResponse<T>>;

  /**
   * Makes a GET request.
   */
  get<T = unknown>(url: string, options?: Omit<HttpRequestConfig, 'url' | 'method'>): Promise<HttpResponse<T>>;

  /**
   * Makes a POST request.
   */
  post<T = unknown>(url: string, body?: RequestBody, options?: Omit<HttpRequestConfig, 'url' | 'method' | 'body'>): Promise<HttpResponse<T>>;

  /**
   * Makes a PUT request.
   */
  put<T = unknown>(url: string, body?: RequestBody, options?: Omit<HttpRequestConfig, 'url' | 'method' | 'body'>): Promise<HttpResponse<T>>;

  /**
   * Makes a PATCH request.
   */
  patch<T = unknown>(url: string, body?: RequestBody, options?: Omit<HttpRequestConfig, 'url' | 'method' | 'body'>): Promise<HttpResponse<T>>;

  /**
   * Makes a DELETE request.
   */
  delete<T = unknown>(url: string, options?: Omit<HttpRequestConfig, 'url' | 'method'>): Promise<HttpResponse<T>>;
}

/**
 * Abstract HTTP Gateway implementation.
 * Provides the foundation for making HTTP requests.
 */
export abstract class AbstractHttpGateway implements IHttpGateway {
  protected readonly logger: ILogger;
  protected readonly defaultTimeout: number;
  protected readonly defaultHeaders: HttpHeaders;

  /**
   * Creates a new HTTP Gateway.
   */
  constructor(options?: {
    logger?: ILogger;
    defaultTimeout?: number;
    defaultHeaders?: HttpHeaders;
  }) {
    this.logger = options?.logger ?? createLogger('HttpGateway');
    this.defaultTimeout = options?.defaultTimeout ?? 30000;
    this.defaultHeaders = options?.defaultHeaders ?? {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Makes an HTTP request.
   */
  async request<T = unknown>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
    const startTime = Date.now();
    const timeout = config.timeoutMs ?? this.defaultTimeout;

    this.logger.debug('Making HTTP request', {
      method: config.method ?? 'GET',
      url: config.url,
      timeout,
    });

    try {
      const response = await this.executeRequest<T>({
        url: config.url,
        method: config.method ?? 'GET',
        headers: { ...this.defaultHeaders, ...config.headers },
        queryParams: config.queryParams,
        body: config.body,
        timeoutMs: timeout,
        followRedirects: config.followRedirects ?? true,
      });

      const responseTimeMs = Date.now() - startTime;

      this.logger.debug('HTTP request completed', {
        method: config.method ?? 'GET',
        url: config.url,
        statusCode: response.statusCode,
        responseTimeMs,
      });

      return {
        ...response,
        responseTimeMs,
      };
    } catch (err) {
      const responseTimeMs = Date.now() - startTime;
      this.logger.error('HTTP request failed', err as Error, {
        method: config.method ?? 'GET',
        url: config.url,
        responseTimeMs,
      });
      throw this.normalizeError(err);
    }
  }

  /**
   * Makes a GET request.
   */
  async get<T = unknown>(url: string, options?: Omit<HttpRequestConfig, 'url' | 'method'>): Promise<HttpResponse<T>> {
    return this.request<T>({ ...options, url, method: 'GET' });
  }

  /**
   * Makes a POST request.
   */
  async post<T = unknown>(
    url: string,
    body?: RequestBody,
    options?: Omit<HttpRequestConfig, 'url' | 'method' | 'body'>
  ): Promise<HttpResponse<T>> {
    return this.request<T>({ ...options, url, method: 'POST', body });
  }

  /**
   * Makes a PUT request.
   */
  async put<T = unknown>(
    url: string,
    body?: RequestBody,
    options?: Omit<HttpRequestConfig, 'url' | 'method' | 'body'>
  ): Promise<HttpResponse<T>> {
    return this.request<T>({ ...options, url, method: 'PUT', body });
  }

  /**
   * Makes a PATCH request.
   */
  async patch<T = unknown>(
    url: string,
    body?: RequestBody,
    options?: Omit<HttpRequestConfig, 'url' | 'method' | 'body'>
  ): Promise<HttpResponse<T>> {
    return this.request<T>({ ...options, url, method: 'PATCH', body });
  }

  /**
   * Makes a DELETE request.
   */
  async delete<T = unknown>(url: string, options?: Omit<HttpRequestConfig, 'url' | 'method'>): Promise<HttpResponse<T>> {
    return this.request<T>({ ...options, url, method: 'DELETE' });
  }

  /**
   * Executes the actual HTTP request.
   * Must be implemented by concrete gateways.
   */
  protected abstract executeRequest<T = unknown>(config: HttpRequestConfig): Promise<HttpResponse<T>>;

  /**
   * Normalizes errors into HttpError structure.
   */
  protected normalizeError(error: unknown): HttpError {
    if (error instanceof Error) {
      return {
        code: 'HTTP_ERROR',
        message: error.message,
        cause: error,
      };
    }
    return {
      code: 'UNKNOWN_ERROR',
      message: String(error),
    };
  }

  /**
   * Builds URL with query parameters.
   */
  protected buildUrl(url: string, queryParams?: QueryParams): string {
    if (!queryParams || Object.keys(queryParams).length === 0) {
      return url;
    }

    const filteredParams = Object.entries(queryParams)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)]);

    if (filteredParams.length === 0) {
      return url;
    }

    const queryString = filteredParams.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${queryString}`;
  }

  /**
   * Serializes request body.
   */
  protected serializeBody(body?: RequestBody): string | undefined {
    if (!body) {
      return undefined;
    }
    if (typeof body === 'string') {
      return body;
    }
    return JSON.stringify(body);
  }

  /**
   * Parses response body.
   */
  protected parseBody<T = unknown>(body: string | object | null | undefined): T {
    if (!body) {
      return {} as T;
    }
    if (typeof body === 'object') {
      return body as T;
    }
    try {
      return JSON.parse(body) as T;
    } catch {
      return body as unknown as T;
    }
  }
}

/**
 * HTTP Gateway implementation using fetch API.
 * Suitable for browser and Node.js environments.
 */
export class FetchHttpGateway extends AbstractHttpGateway {
  /**
   * Creates a new Fetch HTTP Gateway.
   */
  constructor(options?: {
    logger?: Logger;
    defaultTimeout?: number;
    defaultHeaders?: HttpHeaders;
  }) {
    super(options);
  }

  /**
   * Executes the HTTP request using fetch API.
   */
  protected async executeRequest<T = unknown>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
    const url = this.buildUrl(config.url, config.queryParams);
    const body = this.serializeBody(config.body);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs ?? this.defaultTimeout);

    try {
      const response = await fetch(url, {
        method: config.method ?? 'GET',
        headers: config.headers,
        body: config.method !== 'GET' && config.method !== 'DELETE' ? body : undefined,
        signal: controller.signal,
        redirect: config.followRedirects ? 'follow' : 'manual',
      });

      clearTimeout(timeoutId);

      const responseBody = await this.parseResponseBody(response);
      const headers = this.extractHeaders(response);

      return {
        statusCode: response.status,
        body: responseBody as T,
        headers,
        responseTimeMs: 0,
        success: response.status >= 200 && response.status < 300,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Parses response body from fetch response.
   */
  private async parseResponseBody(response: Response): Promise<unknown> {
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const text = await response.text();
      return this.parseBody(text);
    }

    if (contentType.includes('text/')) {
      return await response.text();
    }

    return await response.blob();
  }

  /**
   * Extracts headers from fetch response.
   */
  private extractHeaders(response: Response): HttpHeaders {
    const headers: HttpHeaders = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    return headers;
  }
}

/**
 * Factory for creating HTTP gateways.
 */
export class HttpGatewayFactory {
  /**
   * Creates a default HTTP gateway.
   */
  static createDefault(): IHttpGateway {
    return new FetchHttpGateway();
  }

  /**
   * Creates an HTTP gateway with custom configuration.
   */
  static create(options?: {
    logger?: Logger;
    defaultTimeout?: number;
    defaultHeaders?: HttpHeaders;
  }): IHttpGateway {
    return new FetchHttpGateway(options);
  }
}
