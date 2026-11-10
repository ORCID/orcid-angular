import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RecaptchaDirective } from './recaptcha.directive'
import { SnackbarModule } from '../snackbar/snackbar.module'
import { TurnstileDirective } from './turnstile.directive'

@NgModule({
  declarations: [RecaptchaDirective, TurnstileDirective],
  imports: [CommonModule, SnackbarModule],
  exports: [RecaptchaDirective, TurnstileDirective],
})
export class RecaptchaModule {}
