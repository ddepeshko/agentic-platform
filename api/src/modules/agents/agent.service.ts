import { Injectable } from '@nestjs/common';
import { ConversationStore } from './conversation.store.js';
import type { ChatRequestDto } from './dto/chat-request.dto.js';
import type { ChatResponseDto } from './response/chat.response.dto.js';
import type { PlaygroundResponseDto } from './response/playground.response.dto.js';
import { LlmService } from '@modules/llm/llm.service.js';
import { WEATHER_SYSTEM_PROMPT, weatherToolHandlers, weatherTools } from './weather/tools/index.js';

@Injectable()
export class AgentService {
    constructor(
        private readonly llm: LlmService,
        private readonly conversations: ConversationStore,
    ) {}

    public getPlayground(): PlaygroundResponseDto {
        return {
            model: this.llm.model,
            tools: weatherTools,
        };
    }

    public async chat({ conversationId, message, useTools }: ChatRequestDto): Promise<ChatResponseDto> {
        const id =
            conversationId && this.conversations.has(conversationId)
                ? conversationId
                : this.conversations.create(WEATHER_SYSTEM_PROMPT);

        this.conversations.append(id, { role: 'user', content: message });

        const tools = useTools ? weatherTools : undefined;
        let result = await this.llm.createConversation(this.conversations.get(id), tools);
        this.conversations.append(id, result.message);

        if (result.finishReason === 'tool_calls') {
            for (const toolCall of result.message.tool_calls ?? []) {
                if (toolCall.type !== 'function') continue;
                this.conversations.append(id, {
                    role: 'tool',
                    tool_call_id: toolCall.id,
                    content: await this.runTool(toolCall.function.name, toolCall.function.arguments),
                });
            }

            result = await this.llm.createConversation(this.conversations.get(id), tools);
            this.conversations.append(id, result.message);
        }

        return {
            conversationId: id,
            messages: this.conversations.get(id),
            finishReason: result.finishReason,
            usage: result.usage,
            model: result.model,
            durationMs: result.durationMs,
        };
    }

    private async runTool(name: string, args: string): Promise<string> {
        const handler = weatherToolHandlers[name];
        if (!handler) return `Unknown tool: ${name}`;

        try {
            return JSON.stringify(await handler(JSON.parse(args)));
        } catch (error) {
            return `Tool error: ${error instanceof Error ? error.message : String(error)}`;
        }
    }
}
