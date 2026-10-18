import { Injectable } from '@nestjs/common';
import { LlmService } from '../../services/llm/llm.service.js';
import { ConversationStore } from './conversation.store.js';
import type { ChatRequestDto } from './dto/chat-request.dto.js';
import type { ChatResponseDto } from './response/chat.response.dto.js';
import type { PlaygroundResponseDto } from './response/playground.response.dto.js';
import { WEATHER_SYSTEM_PROMPT, weatherTools } from './tools/weather.tool.js';

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

    // Клієнт надсилає лише текст. Ролі, system prompt і історію визначає бекенд,
    // тож підробити інструкції, відповіді моделі чи результати тулів з клієнта не вийде.
    public async chat({ conversationId, message, useTools }: ChatRequestDto): Promise<ChatResponseDto> {
        const id =
            conversationId && this.conversations.has(conversationId)
                ? conversationId
                : this.conversations.create(WEATHER_SYSTEM_PROMPT);

        this.conversations.append(id, { role: 'user', content: message });

        const result = await this.llm.complete(this.conversations.get(id), useTools ? weatherTools : undefined);
        this.conversations.append(id, result.message);

        return {
            conversationId: id,
            messages: this.conversations.get(id),
            finishReason: result.finishReason,
            usage: result.usage,
            model: result.model,
            durationMs: result.durationMs,
        };
    }
}
