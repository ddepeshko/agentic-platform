import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { PlaygroundContextService } from '../../services/playground-context.service';

@Component({
  selector: 'app-conversation-inspector',
  imports: [JsonPipe, MatListModule],
  templateUrl: './conversation-inspector.component.html',
  styleUrl: './conversation-inspector.component.scss',
})
export class ConversationInspectorComponent {
  protected context = inject(PlaygroundContextService);
}
