import type { ToolDefinition } from '@common/interfaces';

export interface PlaygroundResponseDto {
    model: string;
    tools: ToolDefinition[];
}
