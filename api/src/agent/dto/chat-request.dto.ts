import { z } from 'zod';

// Схема повторює формат повідомлень OpenAI Chat Completions.
// Поля, специфічні для провайдерів, описані явно, бо Zod за замовчуванням
// відкидає невідомі поля, а ці треба повернути моделі без змін:
// - reasoning: роздуми моделі (Ollama);
// - extra_content: thought_signature від Gemini, без якого Gemini відхилить історію з tool_calls.
const ToolCallSchema = z.object({
  id: z.string(),
  type: z.literal('function'),
  function: z.object({
    name: z.string(),
    arguments: z.string(),
  }),
  extra_content: z.record(z.string(), z.unknown()).optional(),
});

const MessageSchema = z.discriminatedUnion('role', [
  z.object({
    role: z.literal('system'),
    content: z.string(),
  }),
  z.object({
    role: z.literal('user'),
    content: z.string().min(1),
  }),
  z.object({
    role: z.literal('assistant'),
    content: z.string().nullish(),
    reasoning: z.string().optional(),
    tool_calls: z.array(ToolCallSchema).optional(),
  }),
  z.object({
    role: z.literal('tool'),
    tool_call_id: z.string(),
    content: z.string(),
  }),
]);

export const ChatRequestSchema = z.object({
  // Сервер stateless: клієнт щоразу надсилає ВСЮ історію (урок 1.1)
  messages: z.array(MessageSchema).min(1),
  useTools: z.boolean().default(false),
});

export type ChatRequestDto = z.infer<typeof ChatRequestSchema>;
