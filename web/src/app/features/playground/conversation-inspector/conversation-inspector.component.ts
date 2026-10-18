import { JsonPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import type { ChatMessage, CompletionResult } from '@core/api';

@Component({
  selector: 'app-conversation-inspector',
  imports: [JsonPipe],
  template: `
    @if (lastResult(); as result) {
      <dl class="stats">
        <dt>finish_reason</dt>
        <dd>
          <code>{{ result.finishReason }}</code>
        </dd>
        <dt>prompt / completion</dt>
        <dd>
          {{ result.usage?.prompt_tokens ?? '—' }} / {{ result.usage?.completion_tokens ?? '—' }}
        </dd>
        <dt>total_tokens</dt>
        <dd>{{ result.usage?.total_tokens ?? '—' }}</dd>
        <dt>час</dt>
        <dd>{{ result.durationMs }} мс</dd>
      </dl>
    }
    <pre class="raw">{{ messages() | json }}</pre>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .stats {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 4px 12px;
      margin: 0;
      font: var(--mat-sys-body-small);

      dt {
        color: var(--mat-sys-on-surface-variant);
      }

      dd {
        margin: 0;
      }
    }

    .raw {
      margin: 0;
      max-height: 50vh;
      overflow: auto;
      padding: 8px;
      border-radius: 8px;
      background: var(--mat-sys-surface-container-highest);
      font-size: 11px;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
  `,
})
export class ConversationInspectorComponent {
  readonly messages = input.required<readonly ChatMessage[]>();
  readonly lastResult = input<CompletionResult | null>(null);
}
