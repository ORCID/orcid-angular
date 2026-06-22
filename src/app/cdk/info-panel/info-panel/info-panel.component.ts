import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: [
    './info-panel.component.scss',
    './info-panel.component.scss-theme.scss',
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class InfoPanelComponent {}
