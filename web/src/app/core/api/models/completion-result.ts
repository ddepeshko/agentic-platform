import type { AssistantMessage } from './assistant-message';
import type { Usage } from './usage';

export interface CompletionResult {
  message: AssistantMessage;
  finishReason: string | null;
  usage: Usage | null;
  model: string;
  durationMs: number;
}
