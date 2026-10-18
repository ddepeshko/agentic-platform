import type OpenAI from 'openai';

// Ollama віддає роздуми моделі в полі reasoning, якого немає в типах OpenAI SDK
export interface AssistantMessage extends OpenAI.ChatCompletionMessage {
    reasoning?: string;
}
