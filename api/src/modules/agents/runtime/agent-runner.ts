import type { LoggerService } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type OpenAI from 'openai';
import type { AssistantMessage, ChatMessage, CompletionResult, ConversationParameters } from '@common/interfaces';
import type { LlmService } from '@modules/llm/llm.service.js';
import type { StopReason } from '../interfaces/index.js';
import type { AgentRunOptions, AgentRunResult, ScopeCheck } from './interfaces/index.js';
import { scopeCheckFormat } from './formats/index.js';

export class AgentRunner {
    private readonly id = randomUUID().slice(0, 8);
    private readonly messages: ChatMessage[] = [];
    private readonly usage: OpenAI.CompletionUsage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
    private durationMs = 0;
    private llmCalls = 0;

    constructor(
        private readonly llmService: LlmService,
        private readonly logger: LoggerService,
        private readonly options: AgentRunOptions,
    ) {}

    public async run(history: ChatMessage[]): Promise<AgentRunResult> {
        const outOfScope = await this.stopIfOutOfScope(history);
        if (outOfScope) {
            return outOfScope;
        }

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

        const output =
            stopReason === 'completed' && this.options.responseFormat ? await this.formatAnswer(history) : undefined;
        this.logFinish(stopReason);
        return {
            messages: this.messages,
            finishReason: result.finishReason,
            stopReason,
            usage: this.usage,
            model: result.model,
            durationMs: this.durationMs,
            output,
        };
    }

    private async complete(history: ChatMessage[]): Promise<CompletionResult> {
        const conversationOptions: ConversationParameters = {
            messages: [...this.compactHistory(history), ...this.messages],
            tools: this.options.tools,
        };
        const result = await this.llmService.createConversation(conversationOptions);
        this.messages.push(result.message);
        this.track(result);

        return result;
    }

    private track({ usage, durationMs }: CompletionResult): void {
        this.usage.prompt_tokens += usage?.prompt_tokens ?? 0;
        this.usage.completion_tokens += usage?.completion_tokens ?? 0;
        this.usage.total_tokens += usage?.total_tokens ?? 0;
        this.durationMs += durationMs;
        this.llmCalls++;
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
        if (!handler) {
            return `Unknown tool: ${name}`;
        }

        try {
            return JSON.stringify(await handler(JSON.parse(args)));
        } catch (error) {
            const reason = error instanceof Error ? error.message : String(error);
            return `Tool error: ${reason}`;
        }
    }

    private async checkScope(history: ChatMessage[]): Promise<CompletionResult> {
        const dialogue = this.compactHistory(history).filter((message) => message.role !== 'system');
        const result = await this.llmService.createConversation({
            messages: [
                {
                    role: 'system',
                    content:
                        'Ти перевіряєш, чи запит користувача належить до зони відповідальності агента. ' +
                        `Зона агента: ${this.options.scope}`,
                },
                ...dialogue,
            ],
            responseFormat: scopeCheckFormat,
        });
        this.track(result);
        return result;
    }

    private async formatAnswer(history: ChatMessage[]): Promise<unknown> {
        const result = await this.llmService.createConversation({
            messages: [
                ...this.compactHistory(history),
                ...this.messages,
                { role: 'user', content: 'Оформи свою останню відповідь у JSON за схемою.' },
            ],
            responseFormat: this.options.responseFormat,
        });
        this.track(result);

        return JSON.parse(result.message.content ?? '');
    }

    private logFinish(stopReason: StopReason): void {
        const summary =
            `${this.id} done: ${stopReason}, ${this.llmCalls} llm calls, ` +
            `${this.durationMs}ms, ${this.usage.total_tokens} tokens`;

        this.logger.log(summary);
    }

    private async stopIfOutOfScope(history: ChatMessage[]): Promise<AgentRunResult | null> {
        const result = await this.checkScope(history);
        const scopeCheck: ScopeCheck = JSON.parse(result.message.content ?? '');
        if (!scopeCheck.inScope) {
            this.messages.push({ role: 'assistant', content: scopeCheck.reply });
            this.logFinish('out_of_scope');
            return {
                messages: this.messages,
                finishReason: result.finishReason,
                stopReason: 'out_of_scope',
                usage: this.usage,
                model: result.model,
                durationMs: this.durationMs,
            };
        }
        return null;
    }

    private compactHistory(history: ChatMessage[]): ChatMessage[] {
        return history.filter((message) => {
            if (['system', 'user'].includes(message.role)) {
                return true;
            }
            if (message.role === 'assistant') {
                return !message.tool_calls?.length;
            }
            return false;
        });
    }
}
