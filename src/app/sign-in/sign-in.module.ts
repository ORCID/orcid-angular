import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SignInComponent } from './pages/sign-in/sign-in.component'
import { IsThisYouModule } from '../cdk/is-this-you/is-this-you.module'
import { SignInRoutingModule } from './sign-in-routing.module'
import { MatDialogModule } from '@angular/material'
import { IsThisYouComponent } from '../cdk/is-this-you/is-this-you.component'

@NgModule({
  declarations: [SignInComponent],
  imports: [
    CommonModule,
    IsThisYouModule,
    MatDialogModule,
    SignInRoutingModule,
  ],
  entryComponents: [IsThisYouComponent],
})
export class SignInModule {}
