import type { ResponseFormat, ToolDefinition, ToolHandler } from '@common/interfaces';

export interface AgentRunOptions {
    tools?: ToolDefinition[];
    handlers: Record<string, ToolHandler>;
    maxSteps: number;
    responseFormat?: ResponseFormat;
    scope: string;
}
