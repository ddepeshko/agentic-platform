import type { ToolDefinition } from '@common/interfaces';
import type { Tool } from './interfaces/index.js';

export function toToolDefinition({ name, description, parameters }: Tool): ToolDefinition {
    return { type: 'function', function: { name, description, parameters } };
}
