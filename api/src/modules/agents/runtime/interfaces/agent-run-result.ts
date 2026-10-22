import type OpenAI from 'openai';
import type { ChatMessage } from '@common/interfaces';
import type { StopReason } from '../../interfaces/index.js';

export interface AgentRunResult {
    messages: ChatMessage[];
    finishReason: string | null;
    stopReason: StopReason;
    usage: OpenAI.CompletionUsage;
    model: string;
    durationMs: number;
    output?: unknown;
}
