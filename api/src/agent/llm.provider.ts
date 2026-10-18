import type { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createLlm, type Llm } from '../core/index.js';
import type { Env } from '../config/env.js';

// Токен для DI: Llm — це тип, а не клас, тому Nest потрібен окремий ключ
export const LLM = Symbol('LLM');

// Ядро (core) нічого не знає про Nest і ConfigService.
// Цей провайдер — місток: бере перевірений конфіг і створює клієнт моделі.
export const llmProvider: Provider<Llm> = {
  provide: LLM,
  useFactory: (config: ConfigService<Env, true>) =>
    createLlm({
      apiKey: config.get('LLM_API_KEY', { infer: true }),
      baseURL: config.get('LLM_BASE_URL', { infer: true }),
      model: config.get('LLM_MODEL', { infer: true }),
    }),
  inject: [ConfigService],
};
