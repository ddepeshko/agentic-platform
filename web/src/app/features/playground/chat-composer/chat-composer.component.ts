import { TextFieldModule } from '@angular/cdk/text-field';
import { Component, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-chat-composer',
  imports: [MatFormFieldModule, MatInput, MatIconButton, MatIcon, TextFieldModule],
  template: `
    <form (submit)="$event.preventDefault(); submit()">
      <mat-form-field appearance="outline" subscriptSizing="dynamic">
        <mat-label>Повідомлення</mat-label>
        <textarea
          #textarea
          matInput
          cdkTextareaAutosize
          cdkAutosizeMinRows="1"
          cdkAutosizeMaxRows="6"
          [value]="text()"
          (input)="text.set(textarea.value)"
          (keydown.enter)="onEnter($event)"
        ></textarea>
        <button matIconSuffix matIconButton type="submit" [disabled]="disabled() || !text().trim()">
          <mat-icon>send</mat-icon>
        </button>
        <mat-hint>Enter — надіслати, Shift+Enter — новий рядок</mat-hint>
      </mat-form-field>
    </form>
  `,
  styles: `
    mat-form-field {
      width: 100%;
    }
  `,
})
export class ChatComposerComponent {
  disabled = input(false);
  send = output<string>();

  protected text = signal('');
  private textarea = viewChild.required<ElementRef<HTMLTextAreaElement>>('textarea');

  protected onEnter(event: Event) {
    if ((event as KeyboardEvent).shiftKey) return;
    event.preventDefault();
    this.submit();
  }

  protected submit() {
    const text = this.text().trim();
    if (this.disabled() || !text) return;

    this.send.emit(text);
    this.text.set('');
    // Якщо введення й Enter прийшли в одному кадрі, [value] ще не оновився — чистимо поле напряму
    this.textarea().nativeElement.value = '';
  }
}
