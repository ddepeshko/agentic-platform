import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ChatMessage, CompletionResult, PlaygroundConfig } from './models';

@Service()
export class AgentApiService {
  private readonly http = inject(HttpClient);

  playgroundResource() {
    return httpResource<PlaygroundConfig>(() => '/api/playground');
  }

  chat(messages: ChatMessage[], useTools: boolean): Observable<CompletionResult> {
    return this.http.post<CompletionResult>('/api/chat', { messages, useTools });
  }
}
