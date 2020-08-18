import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RecaptchaDirective } from './recaptcha.directive'
import { SnackbarModule } from '../snackbar/snackbar.module'

@NgModule({
  declarations: [RecaptchaDirective],
  imports: [CommonModule, SnackbarModule],
  exports: [RecaptchaDirective],
})
export class RecaptchaModule {}
