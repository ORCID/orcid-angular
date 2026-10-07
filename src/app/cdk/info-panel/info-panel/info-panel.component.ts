import { Component, Input } from '@angular/core'

/**
 * Which glyph the panel draws.
 *
 * `check-window` is the filled disc this panel has always drawn and is the
 * default, so the consumers whose frames have not been rechecked keep it.
 * `help` is the outlined question mark the recovery phone interstitial's
 * frame draws (PD-5850).
 */
export type InfoPanelType = 'check-window' | 'help'

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: [
    './info-panel.component.scss',
    './info-panel.component.scss-theme.scss',
  ],
  standalone: false,
})
export class InfoPanelComponent {
  @Input() type: InfoPanelType = 'check-window'
}
