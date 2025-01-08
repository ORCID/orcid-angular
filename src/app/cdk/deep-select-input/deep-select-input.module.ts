import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DeepSelectInputComponent } from './deep-select-input/deep-select-input.component'
import { MatLegacyFormFieldControl } from '@angular/material/legacy-form-field'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatLegacySelectModule } from '@angular/material/legacy-select'
import { SharedModule } from 'src/app/shared/shared.module'
import {
  MatLegacyMenu,
  MatLegacyMenuModule,
} from '@angular/material/legacy-menu'
import { MatMenuModule } from '@angular/material/menu'
import { MatButtonModule } from '@angular/material/button'
import { MatLegacyInputModule } from '@angular/material/legacy-input'
import { MatIconModule } from '@angular/material/icon'

@NgModule({
  declarations: [DeepSelectInputComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatLegacySelectModule,
    SharedModule,
    MatLegacyMenuModule,
    MatLegacyInputModule,
    MatIconModule,
  ],
  exports: [DeepSelectInputComponent],
})
export class DeepSelectInputModule {}
