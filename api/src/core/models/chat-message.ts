import type OpenAI from 'openai';

// Синонім типу з OpenAI SDK (це union), тому type, а не interface
export type ChatMessage = OpenAI.ChatCompletionMessageParam;
