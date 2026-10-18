import { Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import type { ChatMessage } from '@core/api';

@Component({
  selector: 'app-message-item',
  imports: [MatIcon],
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.scss',
  host: {
    '[class]': '"message message--" + message().role',
  },
})
export class MessageItemComponent {
  message = input.required<ChatMessage>();
  index = input.required<number>();

  protected reasoning = computed(() => {
    const message = this.message();
    return message.role === 'assistant' ? message.reasoning : undefined;
  });

  protected toolCalls = computed(() => {
    const message = this.message();
    return message.role === 'assistant' ? (message.tool_calls ?? []) : [];
  });
}
