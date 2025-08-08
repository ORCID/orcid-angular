import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ApplicationRoutes } from '../../../constants'
import { Router } from '@angular/router'
import { first } from 'rxjs/operators'
import { TwoFactorAuthenticationService } from '../../../core/two-factor-authentication/two-factor-authentication.service'

@Component({
  selector: 'app-settings-security-two-factor-auth',
  templateUrl: './settings-security-two-factor-auth.component.html',
  styleUrls: [
    './settings-security-two-factor-auth.component.scss',
    './settings-security-two-factor-auth.component.scss-theme.scss',
  ],
  standalone: false,
})
export class SettingsSecurityTwoFactorAuthComponent implements OnInit {
  @Input() twoFactorState: boolean
  @Output() twoFactorStateOutput = new EventEmitter<any>()
  @Output() loading = new EventEmitter<boolean>()

  constructor(
    private _router: Router,
    private twoFactorAuthenticationService: TwoFactorAuthenticationService
  ) {}

  ngOnInit(): void {}

  disable() {
    this.twoFactorAuthenticationService
      .disable()
      .pipe(first())
      .subscribe((result) => {
        this.loading.next(false)
        if (!result.enabled) {
          this.twoFactorState = result.enabled
          this.twoFactorStateOutput.emit(false)
        }
      })
  }

  twoFactor() {
    if (!this.twoFactorState) {
      this._router.navigate([ApplicationRoutes.twoFactorSetup])
    } else {
      this.loading.next(true)
      this.disable()
    }
  }
}
