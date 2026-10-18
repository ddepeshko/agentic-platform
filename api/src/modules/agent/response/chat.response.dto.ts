import type OpenAI from 'openai';
import type { ChatMessage } from '../../../common/interfaces/index.js';

export interface ChatResponseDto {
    conversationId: string;
    messages: ChatMessage[];
    finishReason: string | null;
    usage: OpenAI.CompletionUsage | null;
    model: string;
    durationMs: number;
}
