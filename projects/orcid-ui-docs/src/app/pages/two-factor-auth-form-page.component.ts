import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { MatSelectModule } from '@angular/material/select'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { TwoFactorAuthFormComponent } from '@orcid/ui'
import { DocumentationPageComponent } from '../components/documentation-page/documentation-page.component'
import '@angular/localize/init'
import { MatCheckboxModule } from '@angular/material/checkbox'

@Component({
  selector: 'two-factor-auth-form-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    TwoFactorAuthFormComponent,
    DocumentationPageComponent,
    ReactiveFormsModule,
  ],
  styleUrls: ['./two-factor-auth-form-page.component.scss'],
  templateUrl: './two-factor-auth-form-page.component.html',
})
export class TwoFactorAuthFormPageComponent implements OnInit {
  showAlert = false
  showHelpText = true
  form: UntypedFormGroup

  constructor(private _fb: UntypedFormBuilder) {}

  ngOnInit() {
    this.form = this._fb.group({
      twoFactorCode: [null, [Validators.minLength(6), Validators.maxLength(6)]],
      twoFactorRecoveryCode: [
        null,
        [Validators.minLength(10), Validators.maxLength(10)],
      ],
    })
  }
}
