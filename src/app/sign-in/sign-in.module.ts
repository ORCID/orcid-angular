import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SignInComponent } from './pages/sign-in/sign-in.component'
import { IsThisYouModule } from '../cdk/is-this-you/is-this-you.module'
import { SignInRoutingModule } from './sign-in-routing.module'

@NgModule({
  declarations: [SignInComponent],
  imports: [CommonModule, IsThisYouModule, SignInRoutingModule],
})
export class SignInModule {}
