/**
 * Telegram Bot Types
 *
 * Type definitions for Telegram Bot API integration.
 */

/**
 * Bot command definition.
 */
export interface BotCommand {
  command: string;
  description: string;
}

/**
 * Bot command scope types.
 */
export type BotCommandScope =
  | BotCommandScopeDefault
  | BotCommandScopePrivate
  | BotCommandScopeGroup
  | BotCommandScopeChat
  | BotCommandScopeChatMember;

/**
 * Default command scope.
 */
export interface BotCommandScopeDefault {
  type: 'default';
}

/**
 * Private chat command scope.
 */
export interface BotCommandScopePrivate {
  type: 'private';
}

/**
 * Group command scope.
 */
export interface BotCommandScopeGroup {
  type: 'group';
}

/**
 * Specific chat command scope.
 */
export interface BotCommandScopeChat {
  type: 'chat';
  chatId: number;
}

/**
 * Chat member command scope.
 */
export interface BotCommandScopeChatMember {
  type: 'chat_member';
  chatId: number;
  userId: number;
}

/**
 * Inline keyboard button.
 */
export interface InlineKeyboardButton {
  text: string;
  url?: string;
  callbackData?: string;
  webAppUrl?: string;
  loginUrl?: string;
  copyText?: string;
  switchInlineQuery?: string;
  switchInlineQueryCurrentChat?: string;
}

/**
 * Reply keyboard button.
 */
export interface ReplyKeyboardButton {
  text: string;
  requestContact?: boolean;
  requestLocation?: boolean;
  requestPoll?: KeyboardButtonPollType;
  webApp?: ReplyKeyboardWebApp;
}

/**
 * Keyboard button poll type.
 */
export interface KeyboardButtonPollType {
  type: 'quiz' | 'regular';
}

/**
 * Reply keyboard web app.
 */
export interface ReplyKeyboardWebApp {
  url: string;
}

/**
 * Inline keyboard markup.
 */
export interface InlineKeyboardMarkup {
  inlineKeyboard: InlineKeyboardButton[][];
}

/**
 * Reply keyboard markup.
 */
export interface ReplyKeyboardMarkup {
  keyboard: ReplyKeyboardButton[][];
  isPersistent?: boolean;
  resizeKeyboard?: boolean;
  oneTimeKeyboard?: boolean;
  inputFieldPlaceholder?: string;
  selective?: boolean;
}

/**
 * Remove reply keyboard.
 */
export interface ReplyKeyboardRemove {
  removeKeyboard: true;
  selective?: boolean;
}

/**
 * Parse mode for messages.
 */
export type ParseMode = 'HTML' | 'Markdown' | 'MarkdownV2';

/**
 * Message entity types.
 */
export type MessageEntityType =
  | 'mention'
  | 'hashtag'
  | 'cashtag'
  | 'botCommand'
  | 'url'
  | 'email'
  | 'phoneNumber'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'spoiler'
  | 'code'
  | 'pre'
  | 'textLink'
  | 'textMention'
  | 'customEmoji';

/**
 * Message entity.
 */
export interface MessageEntity {
  type: MessageEntityType;
  offset: number;
  length: number;
  url?: string;
  user?: BotUser;
  language?: string;
  customEmojiId?: string;
}

/**
 * Bot user (from Telegram).
 */
export interface BotUser {
  id: number;
  isBot: boolean;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  isPremium: boolean;
}

/**
 * Chat types.
 */
export type ChatType = 'private' | 'group' | 'supergroup' | 'channel';

/**
 * Chat information.
 */
export interface BotChat {
  id: number;
  type: ChatType;
  title?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Message.
 */
export interface BotMessage {
  messageId: number;
  from?: BotUser;
  chat: BotChat;
  date: number;
  text?: string;
  entities?: MessageEntity[];
  caption?: string;
  captionEntities?: MessageEntity[];
  replyToMessage?: BotMessage;
}

/**
 * Callback query.
 */
export interface CallbackQuery {
  id: string;
  from: BotUser;
  chat?: BotChat;
  inlineMessageId?: string;
  data?: string;
  gameShortName?: string;
}

/**
 * Update types.
 */
export type UpdateType = 'message' | 'edited_message' | 'callback_query' | 'inline_query' | 'chosen_inline_result' | 'shipping_query' | 'pre_checkout_query' | 'poll' | 'poll_answer' | 'my_chat_member' | 'chat_member' | 'chat_join_request';

/**
 * Webhook info.
 */
export interface WebhookInfo {
  url: string;
  hasCustomCertificate: boolean;
  pendingUpdateCount: number;
  ip?: string;
  lastErrorDate?: number;
  lastErrorMessage?: string;
  lastSynchronizationErrorDate?: number;
  maxConnections?: number;
  allowedUpdates?: UpdateType[];
}

/**
 * Bot info.
 */
export interface BotInfo {
  id: number;
  isBot: boolean;
  firstName: string;
  username: string;
  canJoinGroups: boolean;
  canReadAllGroupMessages: boolean;
  supportsInlineQueries: boolean;
}
