import type { ChatMessage } from '../../core/index.js';

export interface ChatRequestDto {
  messages: ChatMessage[];
  useTools?: boolean;
}
