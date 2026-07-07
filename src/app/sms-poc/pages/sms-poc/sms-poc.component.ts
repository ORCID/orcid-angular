import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
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
  verifyForm: FormGroup = new FormGroup({})
  step: 'send' | 'verify' = 'send'
  loading = false
  response: SmsPocResponse | null = null
  verifyResponse: SmsPocResponse | null = null
  verifiedPhoneNumber: string | null = null
  backendError: string | null = null
  // The provider (AWS/Twilio) selector is an internal testing control; hidden by
  // default so the opt-in view stays provider-agnostic. Reveal with ?debug=true.
  showProviderSelector = false

  loadUtils = () => import('intl-tel-input/utils')

  constructor(
    private _smsPocService: SmsPocService,
    private _route: ActivatedRoute,
    @Inject(LOCALE_ID) private _locale: string
  ) {}

  ngOnInit() {
    this.showProviderSelector =
      this._route.snapshot.queryParamMap.get('debug') === 'true'
    this.smsForm = new FormGroup({
      provider: new FormControl<'aws' | 'twilio'>('aws', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      consent: new FormControl(false, [Validators.requiredTrue]),
    })
    this.verifyForm = new FormGroup({
      code: new FormControl('', [Validators.required]),
    })
  }

  get phoneNumber() {
    return this.smsForm.get('phoneNumber')
  }

  get consent() {
    return this.smsForm.get('consent')
  }

  get code() {
    return this.verifyForm.get('code')
  }

  get invalidPhoneMessage() {
    if (!this.phoneNumber?.touched || this.phoneNumber?.valid) {
      return null
    }
    if (this.phoneNumber.hasError('required')) {
      return 'Phone number is required'
    }
    if (this.phoneNumber.hasError('invalidPhone')) {
      return 'Enter a valid phone number'
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

    const { provider, phoneNumber } = this.smsForm.getRawValue()
    this.loading = true
    this._smsPocService
      .send({ provider, phoneNumber, locale: this._locale })
      .subscribe({
      next: (response) => {
        this.loading = false
        this.response = response
        if (response.success) {
          this.verifiedPhoneNumber =
            response.normalizedPhoneNumber || phoneNumber
          this.step = 'verify'
        } else {
          this.backendError =
            response.errorMessage || response.errorCode || null
        }
      },
      error: () => {
        this.loading = false
        this.backendError = 'Verification code could not be sent'
      },
    })
  }

  onVerify() {
    this.verifyResponse = null
    this.backendError = null

    if (this.verifyForm.invalid || !this.verifiedPhoneNumber) {
      this.verifyForm.markAllAsTouched()
      this.verifyForm.markAllAsDirty()
      return
    }

    this.loading = true
    this._smsPocService
      .verify({
        phoneNumber: this.verifiedPhoneNumber,
        code: this.code?.value,
      })
      .subscribe({
        next: (response) => {
          this.loading = false
          this.verifyResponse = response
          if (!response.success) {
            this.backendError =
              response.errorMessage || response.errorCode || null
          }
        },
        error: () => {
          this.loading = false
          this.backendError = 'Verification failed'
        },
      })
  }

  startOver() {
    this.step = 'send'
    this.response = null
    this.verifyResponse = null
    this.backendError = null
    this.verifiedPhoneNumber = null
    this.verifyForm.reset({ code: '' })
    this.smsForm.get('consent')?.reset(false)
  }
}
