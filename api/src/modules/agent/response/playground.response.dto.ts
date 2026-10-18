import type { ToolDefinition } from '../../../common/interfaces/index.js';

export interface PlaygroundResponseDto {
    model: string;
    systemPrompt: string;
    tools: ToolDefinition[];
}
