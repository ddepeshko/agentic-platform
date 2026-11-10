import { JsonPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PlaygroundContextService } from '../../services/playground-context.service';

@Component({
  selector: 'app-conversation-inspector',
  imports: [JsonPipe, MatListModule, MatProgressBarModule],
  templateUrl: './conversation-inspector.component.html',
  styleUrl: './conversation-inspector.component.scss',
})
export class ConversationInspectorComponent {
  protected context = inject(PlaygroundContextService);

  protected contextPercent = computed(() => {
    const result = this.context.lastResult();
    return result ? (result.contextTokens / result.contextWindow) * 100 : 0;
  });
}
