import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { ChatMessage } from '../../common/interfaces/index.js';

// Поки в пам'яті: після перезапуску сервера розмови зникають. У модулі 4 — таблиці runs / run_steps.
@Injectable()
export class ConversationStore {
    private readonly conversations = new Map<string, ChatMessage[]>();

    create(systemPrompt: string): string {
        const id = randomUUID();
        this.conversations.set(id, [{ role: 'system', content: systemPrompt }]);
        return id;
    }

    has(id: string): boolean {
        return this.conversations.has(id);
    }

    get(id: string): ChatMessage[] {
        return this.conversations.get(id) ?? [];
    }

    append(id: string, message: ChatMessage): void {
        this.conversations.set(id, [...this.get(id), message]);
    }
}
