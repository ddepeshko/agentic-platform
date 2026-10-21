import type { ChatMessage } from './chat-message';
import type { StopReason } from './stop-reason';
import type { Usage } from './usage';

export interface ChatResponse {
  conversationId: string;
  messages: ChatMessage[];
  finishReason: string | null;
  stopReason: StopReason;
  usage: Usage | null;
  model: string;
  durationMs: number;
}
