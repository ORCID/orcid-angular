import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DeepSelectInputComponent } from './deep-select-input/deep-select-input.component'
import { MatFormFieldControl } from '@angular/material/form-field'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatSelectModule } from '@angular/material/select'
import { SharedModule } from 'src/app/shared/shared.module'
import {
  MatMenu,
  MatMenuModule,
} from '@angular/material/menu'
import { MatMenuModule } from '@angular/material/menu'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'

@NgModule({
  declarations: [DeepSelectInputComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    SharedModule,
    MatMenuModule,
    MatInputModule,
    MatIconModule,
  ],
  exports: [DeepSelectInputComponent],
})
export class DeepSelectInputModule {}
