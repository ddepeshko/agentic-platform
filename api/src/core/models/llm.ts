import type { ChatMessage } from './chat-message.js';
import type { CompletionResult } from './completion-result.js';
import type { ToolDefinition } from './tool-definition.js';

export interface Llm {
  model: string;
  complete(
    messages: ChatMessage[],
    tools?: ToolDefinition[],
  ): Promise<CompletionResult>;
}
