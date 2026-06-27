/**
 * Game Scene Type
 *
 * Represents the different scenes/screens in the game.
 */

/**
 * Game scene enumeration.
 */
export enum GameScene {
  /** Main menu screen */
  MAIN_MENU = 'main_menu',
  
  /** Tutorial scene */
  TUTORIAL = 'tutorial',
  
  /** Single player game scene */
  SINGLE_PLAYER = 'single_player',
  
  /** Multiplayer match scene */
  MULTIPLAYER = 'multiplayer',
  
  /** Lobby for finding matches */
  LOBBY = 'lobby',
  
  /** Player inventory screen */
  INVENTORY = 'inventory',
  
  /** Player statistics screen */
  STATISTICS = 'statistics',
  
  /** Daily rewards screen */
  DAILY_REWARDS = 'daily_rewards',
  
  /** Boss battle scene */
  BOSS_BATTLE = 'boss_battle',
  
  /** Tournament scene */
  TOURNAMENT = 'tournament',
  
  /** Settings screen */
  SETTINGS = 'settings',
  
  /** Profile screen */
  PROFILE = 'profile',
  
  /** Museum/collection screen */
  MUSEUM = 'museum',
  
  /** Guild/Clan screen */
  GUILD = 'guild',
  
  /** Shop screen */
  SHOP = 'shop',
}

/**
 * Checks if a scene is a gameplay scene.
 */
export function isGameplayScene(scene: GameScene): boolean {
  return scene === GameScene.SINGLE_PLAYER || 
         scene === GameScene.MULTIPLAYER || 
         scene === GameScene.BOSS_BATTLE ||
         scene === GameScene.TOURNAMENT;
}

/**
 * Checks if a scene is a menu/navigation scene.
 */
export function isMenuScene(scene: GameScene): boolean {
  return scene === GameScene.MAIN_MENU || 
         scene === GameScene.SETTINGS || 
         scene === GameScene.PROFILE ||
         scene === GameScene.SHOP;
}