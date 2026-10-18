import type { ToolDefinition } from './tool-definition';

export interface PlaygroundConfig {
  model: string;
  systemPrompt: string;
  tools: ToolDefinition[];
}
