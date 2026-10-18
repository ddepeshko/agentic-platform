import { Component, inject, linkedSignal, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatTooltip } from '@angular/material/tooltip';
import { AgentApiService } from '@core/api';
import { MessageItemComponent } from '@shared/message-item/message-item.component';
import { ChatComposerComponent } from './chat-composer/chat-composer.component';
import { ChatSessionService } from './chat-session.service';
import type { ChatSettings } from './chat-settings';
import { ConversationInspectorComponent } from './conversation-inspector/conversation-inspector.component';
import { SettingsPanelComponent } from './settings-panel/settings-panel.component';

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
  providers: [ChatSessionService],
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.scss',
})
export class PlaygroundComponent {
  protected session = inject(ChatSessionService);
  protected config = inject(AgentApiService).playgroundResource();

  // Дефолти з API; коли конфіг завантажиться, налаштування оновляться самі
  protected settings = linkedSignal<ChatSettings>(() => ({
    systemPrompt: this.config.hasValue() ? this.config.value().systemPrompt : '',
    useTools: true,
  }));

  protected inspectorOpen = signal(true);
}
