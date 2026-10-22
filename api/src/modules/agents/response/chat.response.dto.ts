import type OpenAI from 'openai';
import type { ChatMessage } from '@common/interfaces';
import type { StopReason } from '../interfaces/index.js';

export interface ChatResponseDto {
    conversationId: string;
    messages: ChatMessage[];
    finishReason: string | null;
    stopReason: StopReason;
    usage: OpenAI.CompletionUsage | null;
    model: string;
    durationMs: number;
    output?: unknown;
}
