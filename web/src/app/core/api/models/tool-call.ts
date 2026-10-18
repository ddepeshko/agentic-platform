export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
  // thought_signature від Gemini: треба повертати моделі без змін
  extra_content?: Record<string, unknown>;
}
