import type OpenAI from 'openai';
import type { AssistantMessage } from './assistant-message.js';

export interface CompletionResult {
    message: AssistantMessage;
    finishReason: string | null;
    usage: OpenAI.CompletionUsage | null;
    model: string;
    durationMs: number;
}
