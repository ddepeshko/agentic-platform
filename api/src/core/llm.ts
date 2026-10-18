import OpenAI from 'openai';
import type {
  ChatMessage,
  CompletionResult,
  Llm,
  LlmSettings,
  ToolDefinition,
} from './models/index.js';

export function createLlm(settings: LlmSettings): Llm {
  const client = new OpenAI({
    apiKey: settings.apiKey,
    baseURL: settings.baseURL,
  });

  async function complete(
    messages: ChatMessage[],
    tools?: ToolDefinition[],
  ): Promise<CompletionResult> {
    const startedAt = Date.now();

    const response = await client.chat.completions.create({
      model: settings.model,
      messages,
      ...(tools?.length ? { tools } : {}),
    });

    const choice = response.choices[0];
    if (!choice) {
      throw new Error('Модель не повернула жодного варіанта відповіді');
    }

    return {
      message: choice.message,
      finishReason: choice.finish_reason,
      usage: response.usage ?? null,
      model: response.model,
      durationMs: Date.now() - startedAt,
    };
  }

  return { model: settings.model, complete };
}
