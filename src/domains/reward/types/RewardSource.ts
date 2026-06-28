/**
 * RewardSource Enum
 *
 * Defines the source modules that can request rewards.
 */

/**
 * Source modules that can request rewards.
 */
export enum RewardSource {
  /** Daily login rewards */
  DAILY_REWARD = 'daily_reward',
  
  /** Quest completion rewards */
  QUEST = 'quest',
  
  /** Achievement unlock rewards */
  ACHIEVEMENT = 'achievement',
  
  /** Expedition completion rewards */
  EXPEDITION = 'expedition',
  
  /** Battle/PvP rewards */
  BATTLE = 'battle',
  
  /** Guild-related rewards */
  GUILD = 'guild',
  
  /** Museum-related rewards */
  MUSEUM = 'museum',
  
  /** Academy/research rewards */
  ACADEMY = 'academy',
  
  /** Battle pass rewards */
  BATTLE_PASS = 'battle_pass',
  
  /** Tournament rewards */
  TOURNAMENT = 'tournament',
  
  /** Boss battle rewards */
  BOSS_BATTLE = 'boss_battle',
  
  /** Story mode rewards */
  STORY_MODE = 'story_mode',
  
  /** Admin/gm granted rewards */
  ADMIN = 'admin',
  
  /** First-time user rewards */
  ONBOARDING = 'onboarding',
  
  /** Referral rewards */
  REFERRAL = 'referral',
  
  /** Ad-watched rewards */
  AD_REWARD = 'ad_reward',
}

/**
 * Reward source display information.
 */
export const REWARD_SOURCE_DISPLAY: Record<RewardSource, { label: string; description: string }> = {
  [RewardSource.DAILY_REWARD]: { label: 'Daily Reward', description: 'Daily login bonus' },
  [RewardSource.QUEST]: { label: 'Quest', description: 'Quest completion' },
  [RewardSource.ACHIEVEMENT]: { label: 'Achievement', description: 'Achievement unlock' },
  [RewardSource.EXPEDITION]: { label: 'Expedition', description: 'Expedition completion' },
  [RewardSource.BATTLE]: { label: 'Battle', description: 'PvP battle rewards' },
  [RewardSource.GUILD]: { label: 'Guild', description: 'Guild activities' },
  [RewardSource.MUSEUM]: { label: 'Museum', description: 'Museum displays' },
  [RewardSource.ACADEMY]: { label: 'Academy', description: 'Research completion' },
  [RewardSource.BATTLE_PASS]: { label: 'Battle Pass', description: 'Seasonal rewards' },
  [RewardSource.TOURNAMENT]: { label: 'Tournament', description: 'Tournament prizes' },
  [RewardSource.BOSS_BATTLE]: { label: 'Boss Battle', description: 'Boss defeat rewards' },
  [RewardSource.STORY_MODE]: { label: 'Story Mode', description: 'Story chapter completion' },
  [RewardSource.ADMIN]: { label: 'Admin', description: 'Admin granted' },
  [RewardSource.ONBOARDING]: { label: 'Onboarding', description: 'First-time user rewards' },
  [RewardSource.REFERRAL]: { label: 'Referral', description: 'Referral bonuses' },
  [RewardSource.AD_REWARD]: { label: 'Ad Reward', description: 'Rewarded ad viewing' },
};

/**
 * Checks if a source is valid.
 */
export function isValidRewardSource(source: string): source is RewardSource {
  return Object.values(RewardSource).includes(source as RewardSource);
}