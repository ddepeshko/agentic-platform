import type { ToolCall } from './tool-call';

export interface AssistantMessage {
  role: 'assistant';
  content?: string | null;
  // роздуми моделі (Ollama віддає їх окремим полем)
  reasoning?: string;
  tool_calls?: ToolCall[];
}
