import { Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import type { ChatMessage } from '@core/api';

@Component({
  selector: 'app-message-item',
  imports: [MatCardModule, MatChipsModule, MatExpansionModule, MatIcon],
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.scss',
  host: {
    '[class]': '"message message--" + message().role',
  },
})
export class MessageItemComponent {
  public message = input.required<ChatMessage>();
  public index = input.required<number>();

  protected reasoning = computed(() => {
    const message = this.message();
    return message.role === 'assistant' ? message.reasoning : undefined;
  });

  protected toolCalls = computed(() => {
    const message = this.message();
    return message.role === 'assistant' ? (message.tool_calls ?? []) : [];
  });
}
