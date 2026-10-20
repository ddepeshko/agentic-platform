export interface ToolHandler {
    (args: Record<string, unknown>): Promise<unknown>;
}
