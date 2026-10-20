export interface ChatRequestDto {
    conversationId?: string;
    message: string;
    useTools?: boolean;
}
