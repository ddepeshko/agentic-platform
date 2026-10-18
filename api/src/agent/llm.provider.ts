import type { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createLlm, type Llm } from '../core/index.js';

// Llm — це тип, а не клас, тому для DI потрібен окремий токен
export const LLM = Symbol('LLM');

export const llmProvider: Provider<Llm> = {
  provide: LLM,
  useFactory: (config: ConfigService) =>
    createLlm({
      apiKey: config.getOrThrow('LLM_API_KEY'),
      baseURL: config.getOrThrow('LLM_BASE_URL'),
      model: config.getOrThrow('LLM_MODEL'),
    }),
  inject: [ConfigService],
};
