import type { AssistantMessage } from './assistant-message';
import type { SystemMessage } from './system-message';
import type { ToolMessage } from './tool-message';
import type { UserMessage } from './user-message';

// Union не можна описати інтерфейсом, тому тут type
export type ChatMessage = SystemMessage | UserMessage | AssistantMessage | ToolMessage;
