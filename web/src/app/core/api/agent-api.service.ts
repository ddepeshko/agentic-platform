import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ChatRequest, ChatResponse, PlaygroundConfig } from './models';

@Service()
export class AgentApiService {
  private readonly http = inject(HttpClient);

  public playgroundResource() {
    return httpResource<PlaygroundConfig>(() => '/api/playground');
  }

  public chat(request: ChatRequest): Observable<ChatResponse> {
    return this.http.post<ChatResponse>('/api/chat', request);
  }
}
