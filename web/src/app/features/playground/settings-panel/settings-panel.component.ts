import { Component, input, model } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import type { ToolDefinition } from '@core/api';
import type { ChatSettings } from '../chat-settings';

@Component({
  selector: 'app-settings-panel',
  imports: [FormField, MatFormFieldModule, MatInput, MatSlideToggle],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>System prompt</mat-label>
      <textarea matInput rows="5" [formField]="settingsForm.systemPrompt"></textarea>
      <mat-hint>Застосовується на початку нової розмови</mat-hint>
    </mat-form-field>

    <mat-slide-toggle [formField]="settingsForm.useTools">Передавати тули моделі</mat-slide-toggle>

    @if (tools().length > 0) {
      <p class="tools">
        Тули:
        @for (tool of tools(); track tool.function.name) {
          <code>{{ tool.function.name }}</code>
        }
      </p>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .tools {
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-small);
    }
  `,
})
export class SettingsPanelComponent {
  readonly settings = model.required<ChatSettings>();
  readonly tools = input<ToolDefinition[]>([]);

  protected readonly settingsForm = form(this.settings);
}
