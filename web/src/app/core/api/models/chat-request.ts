export interface ChatRequest {
  conversationId?: string;
  message: string;
  useTools: boolean;
}
