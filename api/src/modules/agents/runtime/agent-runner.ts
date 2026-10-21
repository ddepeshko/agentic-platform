import type OpenAI from 'openai';
import type { AssistantMessage, ChatMessage, CompletionResult } from '@common/interfaces';
import type { LlmService } from '@modules/llm/llm.service.js';
import type { StopReason } from '../interfaces/index.js';
import type { AgentRunOptions, AgentRunResult } from './interfaces/index.js';

export class AgentRunner {
    private readonly messages: ChatMessage[] = [];
    private readonly usage: OpenAI.CompletionUsage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
    private durationMs = 0;

    constructor(
        private readonly llmService: LlmService,
        private readonly options: AgentRunOptions,
    ) {}

    public async run(history: ChatMessage[]): Promise<AgentRunResult> {
        let result = await this.complete(history);
        let stopReason: StopReason = 'completed';
        let step = 0;

        while (result.finishReason === 'tool_calls') {
            const limitReached = step === this.options.maxSteps;
            await this.answerToolCalls(result.message, limitReached);

            if (limitReached) {
                stopReason = 'max_steps';
                break;
            }

            result = await this.complete(history);
            step++;
        }

        return {
            messages: this.messages,
            finishReason: result.finishReason,
            stopReason,
            usage: this.usage,
            model: result.model,
            durationMs: this.durationMs,
        };
    }

    private async complete(history: ChatMessage[]): Promise<CompletionResult> {
        const result = await this.llmService.createConversation([...history, ...this.messages], this.options.tools);
        this.messages.push(result.message);

        this.usage.prompt_tokens += result.usage?.prompt_tokens ?? 0;
        this.usage.completion_tokens += result.usage?.completion_tokens ?? 0;
        this.usage.total_tokens += result.usage?.total_tokens ?? 0;
        this.durationMs += result.durationMs;

        return result;
    }

    private async answerToolCalls(message: AssistantMessage, limitReached: boolean): Promise<void> {
        for (const toolCall of message.tool_calls ?? []) {
            if (toolCall.type !== 'function') continue;
            this.messages.push({
                role: 'tool',
                tool_call_id: toolCall.id,
                content: limitReached
                    ? 'Not executed: step limit reached'
                    : await this.runTool(toolCall.function.name, toolCall.function.arguments),
            });
        }
    }

    private async runTool(name: string, args: string): Promise<string> {
        const handler = this.options.handlers[name];
        if (!handler) return `Unknown tool: ${name}`;

        try {
            return JSON.stringify(await handler(JSON.parse(args)));
        } catch (error) {
            return `Tool error: ${error instanceof Error ? error.message : String(error)}`;
        }
    }
}
