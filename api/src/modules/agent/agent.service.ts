import { Injectable } from '@nestjs/common';
import type { CompletionResult } from '../../common/interfaces/index.js';
import { LlmService } from '../../services/llm/llm.service.js';
import type { ChatRequestDto } from './dto/chat-request.dto.js';
import type { PlaygroundResponseDto } from './response/playground.response.dto.js';
import { WEATHER_SYSTEM_PROMPT, weatherTools } from './tools/weather.tool.js';

@Injectable()
export class AgentService {
    constructor(private readonly llm: LlmService) {}

    getPlayground(): PlaygroundResponseDto {
        return {
            model: this.llm.model,
            systemPrompt: WEATHER_SYSTEM_PROMPT,
            tools: weatherTools,
        };
    }

    chat({ messages, useTools }: ChatRequestDto): Promise<CompletionResult> {
        return this.llm.complete(messages, useTools ? weatherTools : undefined);
    }
}
