import { Inject, Injectable } from '@nestjs/common';
import type { CompletionResult, Llm } from '../core/index.js';
import { WEATHER_SYSTEM_PROMPT, weatherTools } from '../domain/index.js';
import type { ChatRequestDto } from './dto/chat-request.dto.js';
import { LLM } from './llm.provider.js';

@Injectable()
export class AgentService {
  constructor(@Inject(LLM) private readonly llm: Llm) {}

  getPlayground() {
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
