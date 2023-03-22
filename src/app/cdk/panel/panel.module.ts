import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'

import { PanelElementComponent } from './panel-element/panel-element.component'
import { PanelPrivacyComponent } from './panel-privacy/panel-privacy.component'
import { PanelComponent } from './panel/panel.component'
import { PanelDataComponent } from './panel-data/panel-data.component'
import { PanelSourceComponent } from './panel-source/panel-source.component'
import { A11yLinkModule } from '../a11y-link/a11y-link.module'
import { PanelsComponent } from './panels/panels.component'
import { PanelDataLineComponent } from './panel-data-line/panel-data-line.component'
import { PanelElementSourceComponent } from './panel-element-source/panel-element-source.component'
import { MatDividerModule } from '@angular/material/divider'
import { PanelExpandButtonsComponent } from './panel-expand-buttons/panel-expand-buttons.component'
import { MatMenuModule } from '@angular/material/menu'
import { SortLabelPipe } from './sort-label.pipe'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { PrivacySelectorModule } from '../privacy-selector/privacy-selector.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { SharedModule } from '../../shared/shared.module'
import { AppPanelActivityActionAriaLabelPipe } from '../../shared/pipes/app-panel-activity-action-aria-label/app-panel-activity-action-aria-label.pipe'

@NgModule({
  declarations: [
    PanelComponent,
    PanelElementComponent,
    PanelPrivacyComponent,
    PanelDataComponent,
    PanelSourceComponent,
    PanelsComponent,
    PanelDataLineComponent,
    PanelElementSourceComponent,
    PanelExpandButtonsComponent,
    SortLabelPipe,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatDividerModule,
    MatMenuModule,
    MatCheckboxModule,
    PrivacySelectorModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressBarModule,
    SharedModule,
    A11yLinkModule,
  ],
  exports: [
    PanelComponent,
    PanelElementComponent,
    PanelPrivacyComponent,
    PanelDataComponent,
    PanelSourceComponent,
    A11yLinkModule,
    PanelsComponent,
    PanelDataLineComponent,
    PanelElementSourceComponent,
    PanelExpandButtonsComponent,
  ],
  providers: [AppPanelActivityActionAriaLabelPipe],
})
export class PanelModule {}
