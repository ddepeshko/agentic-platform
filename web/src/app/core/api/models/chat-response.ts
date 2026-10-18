import type { ChatMessage } from './chat-message';
import type { Usage } from './usage';

export interface ChatResponse {
  conversationId: string;
  messages: ChatMessage[];
  finishReason: string | null;
  usage: Usage | null;
  model: string;
  durationMs: number;
}
