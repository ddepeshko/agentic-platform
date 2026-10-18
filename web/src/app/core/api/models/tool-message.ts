export interface ToolMessage {
  role: 'tool';
  tool_call_id: string;
  content: string;
}
