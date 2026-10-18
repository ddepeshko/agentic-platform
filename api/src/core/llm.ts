import OpenAI from 'openai';

// Ядро не знає, звідки береться конфіг (.env, БД, тест).
// Налаштування передає той, хто створює клієнт: це робить ядро незалежним від платформи.
export type LlmSettings = {
  apiKey: string;
  baseURL: string;
  model: string;
};

export type ChatMessage = OpenAI.ChatCompletionMessageParam;
export type ToolDefinition = OpenAI.ChatCompletionTool;

// Ollama віддає роздуми моделі в полі `reasoning`, якого немає в типах OpenAI SDK.
export type AssistantMessage = OpenAI.ChatCompletionMessage & {
  reasoning?: string;
};

export type CompletionResult = {
  message: AssistantMessage;
  finishReason: string | null;
  usage: OpenAI.CompletionUsage | null;
  model: string;
  durationMs: number;
};

export function createLlm(settings: LlmSettings) {
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
      // Порожній масив tools деякі провайдери відхиляють, тому не передаємо його зовсім
      ...(tools && tools.length > 0 ? { tools } : {}),
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

export type Llm = ReturnType<typeof createLlm>;
