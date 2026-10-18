import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AgentApiService, type ChatMessage, type ChatResponse } from '@core/api';
import type { ChatSettings } from '../models';

@Injectable()
export class ChatSessionService {
  private api = inject(AgentApiService);

  // Історію тримає бекенд; тут лише її копія для відображення
  conversationId = signal<string | undefined>(undefined);
  messages = signal<ChatMessage[]>([]);
  // Текст, що вже надіслано, але відповіді ще немає: показуємо його, поки модель думає
  pendingText = signal('');
  lastResult = signal<ChatResponse | null>(null);
  loading = signal(false);
  error = signal('');

  waitingForTool = computed(() => this.lastResult()?.finishReason === 'tool_calls');

  async send(text: string, settings: ChatSettings) {
    this.pendingText.set(text);
    this.loading.set(true);
    this.error.set('');

    try {
      const result = await firstValueFrom(
        this.api.chat({
          conversationId: this.conversationId(),
          message: text,
          useTools: settings.useTools,
        }),
      );
      this.conversationId.set(result.conversationId);
      this.messages.set(result.messages);
      this.lastResult.set(result);
    } catch (e) {
      const err = e as HttpErrorResponse;
      this.error.set(err.error?.message ?? err.message);
    } finally {
      this.pendingText.set('');
      this.loading.set(false);
    }
  }

  reset() {
    this.conversationId.set(undefined);
    this.messages.set([]);
    this.lastResult.set(null);
    this.error.set('');
  }
}
