import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { SmsPocService } from 'src/app/core/sms-poc/sms-poc.service'
import { SmsPocResponse } from 'src/app/types/sms-poc.endpoint'

@Component({
  selector: 'app-sms-poc',
  standalone: false,
  templateUrl: './sms-poc.component.html',
  styleUrls: ['./sms-poc.component.scss'],
})
export class SmsPocComponent implements OnInit {
  smsForm: FormGroup = new FormGroup({})
  loading = false
  response: SmsPocResponse | null = null
  backendError: string | null = null

  loadUtils = () => import('intl-tel-input/utils')

  constructor(private _smsPocService: SmsPocService) {}

  ngOnInit() {
    this.smsForm = new FormGroup({
      provider: new FormControl<'aws' | 'twilio'>('aws', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      message: new FormControl('ORCID SMS POC test', [
        Validators.required,
        Validators.maxLength(1600),
      ]),
    })
  }

  get phoneNumber() {
    return this.smsForm.get('phoneNumber')
  }

  get message() {
    return this.smsForm.get('message')
  }

  get invalidPhoneMessage() {
    if (!this.phoneNumber?.touched || this.phoneNumber?.valid) {
      return null
    }
    if (this.phoneNumber.hasError('required')) {
      return $localize`:@@smsPoc.phoneRequired:Phone number is required`
    }
    if (this.phoneNumber.hasError('invalidPhone')) {
      return $localize`:@@smsPoc.phoneInvalid:Enter a valid phone number`
    }
    return null
  }

  onSubmit() {
    this.response = null
    this.backendError = null

    if (this.smsForm.invalid) {
      this.smsForm.markAllAsTouched()
      this.smsForm.markAllAsDirty()
      return
    }

    this.loading = true
    this._smsPocService.send(this.smsForm.getRawValue()).subscribe({
      next: (response) => {
        this.loading = false
        this.response = response
        if (!response.success) {
          this.backendError =
            response.errorMessage || response.errorCode || null
        }
      },
      error: () => {
        this.loading = false
        this.backendError = $localize`:@@smsPoc.sendFailed:SMS send failed`
      },
    })
  }
}
