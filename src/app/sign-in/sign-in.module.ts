import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SignInComponent } from './pages/sign-in/sign-in.component'
import { SignInRoutingModule } from './sign-in-routing.module'
import { MatDialogModule } from '@angular/material'

@NgModule({
  declarations: [SignInComponent],
  imports: [CommonModule, SignInRoutingModule, MatDialogModule],
  entryComponents: [],
})
export class SignInModule {}
