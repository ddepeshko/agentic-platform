import type { ChatMessage } from '../../../common/interfaces/index.js';

export interface ChatRequestDto {
    messages: ChatMessage[];
    useTools?: boolean;
}
