import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AgentApiService, type ChatMessage, type CompletionResult } from '@core/api';
import type { ChatSettings } from './chat-settings';

@Injectable()
export class ChatSessionService {
  private api = inject(AgentApiService);

  messages = signal<ChatMessage[]>([]);
  lastResult = signal<CompletionResult | null>(null);
  loading = signal(false);
  error = signal('');

  // Модель попросила тул — продовжити зможемо, коли навчимося їх виконувати (урок 1.3)
  waitingForTool = computed(() => this.lastResult()?.finishReason === 'tool_calls');

  async send(text: string, settings: ChatSettings) {
    if (this.messages().length === 0 && settings.systemPrompt) {
      this.messages.set([{ role: 'system', content: settings.systemPrompt }]);
    }
    this.messages.update((list) => [...list, { role: 'user', content: text }]);
    this.loading.set(true);
    this.error.set('');

    try {
      const result = await firstValueFrom(this.api.chat(this.messages(), settings.useTools));
      this.lastResult.set(result);
      this.messages.update((list) => [...list, result.message]);
    } catch (e) {
      const err = e as HttpErrorResponse;
      this.error.set(err.error?.message ?? err.message);
    } finally {
      this.loading.set(false);
    }
  }

  removeLastStep() {
    this.messages.update((list) => list.slice(0, -1));
    this.lastResult.set(null);
  }

  reset() {
    this.messages.set([]);
    this.lastResult.set(null);
    this.error.set('');
  }
}
