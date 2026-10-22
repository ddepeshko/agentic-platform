import type OpenAI from 'openai';

// Лише json_schema: json_object не гарантує структуру, а text — це звичайна відповідь без формату
export type ResponseFormat = OpenAI.ResponseFormatJSONSchema;
