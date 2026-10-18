import { TextFieldModule } from '@angular/cdk/text-field';
import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField, pattern, required, submit } from '@angular/forms/signals';
import { MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { PlaygroundContextService } from '../../services/playground-context.service';

@Component({
  selector: 'app-chat-composer',
  imports: [FormField, MatFormFieldModule, MatInput, MatIconButton, MatIcon, TextFieldModule],
  templateUrl: './chat-composer.component.html',
  styleUrl: './chat-composer.component.scss',
})
export class ChatComposerComponent {
  private context = inject(PlaygroundContextService);

  protected draft = signal({ text: '' });
  protected draftForm = form(this.draft, (path) => {
    required(path.text);
    pattern(path.text, /\S/);
  });

  protected canSubmit = computed(() => this.context.canSend() && this.draftForm().valid());

  protected onEnter(event: Event) {
    if ((event as KeyboardEvent).shiftKey) return;
    event.preventDefault();
    this.submit();
  }

  protected submit() {
    if (!this.canSubmit()) return;

    submit(this.draftForm, async (form) => {
      const text = form.text().value().trim();
      form().reset({ text: '' });
      await this.context.send(text);
    });
  }
}
