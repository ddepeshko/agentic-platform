import type { ChatMessage } from './chat-message.js';
import type { ResponseFormat } from './response-format.js';
import type { ToolDefinition } from './tool-definition.js';

export interface ConversationParameters {
    messages: ChatMessage[];
    tools?: ToolDefinition[];
    responseFormat?: ResponseFormat;
}
