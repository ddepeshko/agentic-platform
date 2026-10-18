import { Component, inject } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { MatChipsModule } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { PlaygroundContextService } from '../../services/playground-context.service';

@Component({
  selector: 'app-settings-panel',
  imports: [FormField, MatSlideToggle, MatChipsModule, MatIcon],
  templateUrl: './settings-panel.component.html',
  styleUrl: './settings-panel.component.scss',
})
export class SettingsPanelComponent {
  protected context = inject(PlaygroundContextService);
  protected settingsForm = form(this.context.settings);
}
