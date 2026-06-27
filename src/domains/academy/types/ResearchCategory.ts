/**
 * Research Category
 *
 * Defines the different categories of research available in the Academy.
 */

export enum ResearchCategory {
  /** Historical research about past civilizations */
  HISTORY = 'history',
  /** Scientific and technological discoveries */
  SCIENCE = 'science',
  /** Cultural and artistic developments */
  CULTURE = 'culture',
  /** Economic and trade research */
  ECONOMICS = 'economics',
  /** Military and strategic studies */
  MILITARY = 'military',
  /** Exploration and geography */
  EXPLORATION = 'exploration',
  /** Philosophy and thought */
  PHILOSOPHY = 'philosophy',
  /** Religion and spirituality */
  RELIGION = 'religion',
  /** Architecture and engineering */
  ARCHITECTURE = 'architecture',
  /** Language and communication */
  LANGUAGE = 'language',
}

/**
 * Category display information.
 */
export const RESEARCH_CATEGORY_INFO: Record<ResearchCategory, { displayName: string; description: string }> = {
  [ResearchCategory.HISTORY]: {
    displayName: 'History',
    description: 'Research about past civilizations and events',
  },
  [ResearchCategory.SCIENCE]: {
    displayName: 'Science',
    description: 'Scientific and technological discoveries',
  },
  [ResearchCategory.CULTURE]: {
    displayName: 'Culture',
    description: 'Cultural and artistic developments',
  },
  [ResearchCategory.ECONOMICS]: {
    displayName: 'Economics',
    description: 'Economic and trade research',
  },
  [ResearchCategory.MILITARY]: {
    displayName: 'Military',
    description: 'Military and strategic studies',
  },
  [ResearchCategory.EXPLORATION]: {
    displayName: 'Exploration',
    description: 'Exploration and geography',
  },
  [ResearchCategory.PHILOSOPHY]: {
    displayName: 'Philosophy',
    description: 'Philosophy and thought',
  },
  [ResearchCategory.RELIGION]: {
    displayName: 'Religion',
    description: 'Religion and spirituality',
  },
  [ResearchCategory.ARCHITECTURE]: {
    displayName: 'Architecture',
    description: 'Architecture and engineering',
  },
  [ResearchCategory.LANGUAGE]: {
    displayName: 'Language',
    description: 'Language and communication',
  },
};

/**
 * Gets the display name for a research category.
 */
export function getResearchCategoryDisplayName(category: ResearchCategory): string {
  return RESEARCH_CATEGORY_INFO[category].displayName;
}

/**
 * Gets the description for a research category.
 */
export function getResearchCategoryDescription(category: ResearchCategory): string {
  return RESEARCH_CATEGORY_INFO[category].description;
}