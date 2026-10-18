import { Component, inject, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatTooltip } from '@angular/material/tooltip';
import { MessageItemComponent } from '@shared/message-item/message-item.component';
import { ChatComposerComponent } from './components/chat-composer/chat-composer.component';
import { PlaygroundContextService } from './services/playground-context.service';
import { ConversationInspectorComponent } from './components/conversation-inspector/conversation-inspector.component';
import { SettingsPanelComponent } from './components/settings-panel/settings-panel.component';

@Component({
  selector: 'app-playground',
  imports: [
    ChatComposerComponent,
    ConversationInspectorComponent,
    MessageItemComponent,
    SettingsPanelComponent,
    MatButton,
    MatIconButton,
    MatIcon,
    MatExpansionModule,
    MatProgressBar,
    MatSidenavModule,
    MatToolbar,
    MatTooltip,
  ],
  providers: [PlaygroundContextService],
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.scss',
})
export class PlaygroundComponent {
  protected context = inject(PlaygroundContextService);

  protected inspectorOpen = signal(true);
}
