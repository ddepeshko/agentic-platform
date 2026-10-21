import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AgentApiService, type ChatMessage, type ChatResponse } from '@core/api';
import type { ChatSettings } from '../models';

// Контекст сторінки playground (аналог React Context): PlaygroundComponent провайдить його,
// а дочірні компоненти отримують той самий екземпляр через inject() — без input/output ланцюжків.
@Injectable()
export class PlaygroundContextService {
  private api = inject(AgentApiService);

  public config = this.api.playgroundResource();
  public model = computed(() => (this.config.hasValue() ? this.config.value().model : ''));
  public tools = computed(() => (this.config.hasValue() ? this.config.value().tools : []));

  public settings = signal<ChatSettings>({ useTools: true });

  // Історію тримає бекенд; тут лише її копія для відображення
  public conversationId = signal<string | undefined>(undefined);
  public messages = signal<ChatMessage[]>([]);
  public pendingText = signal('');
  public lastResult = signal<ChatResponse | null>(null);
  public loading = signal(false);
  public error = signal('');

  public stoppedByLimit = computed(() => this.lastResult()?.stopReason === 'max_steps');
  public canSend = computed(() => !this.loading());

  public async send(text: string) {
    this.pendingText.set(text);
    this.loading.set(true);
    this.error.set('');

    try {
      const result = await firstValueFrom(
        this.api.chat({
          conversationId: this.conversationId(),
          message: text,
          useTools: this.settings().useTools,
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

  public reset() {
    this.conversationId.set(undefined);
    this.messages.set([]);
    this.lastResult.set(null);
    this.error.set('');
  }
}
