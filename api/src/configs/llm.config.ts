import { registerAs } from '@nestjs/config';

export const llmConfig = registerAs('llm', () => ({
    baseURL: process.env.LLM_BASE_URL,
    apiKey: process.env.LLM_API_KEY,
    model: process.env.LLM_MODEL ?? '',
    contextWindow: parseInt(process.env.LLM_CONTEXT_WINDOW ?? '', 10) || 4096,
}));
