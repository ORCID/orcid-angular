import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LinkAccountComponent } from './pages/link-account/link-account.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatCardModule } from '@angular/material/card'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { LinkAccountRoutingModule } from './link-account-routing.module'
import { SignInModule } from '../sign-in/sign-in.module'
import { SharedModule } from '../shared/shared.module'
import { A11yLinkModule } from '../cdk/a11y-link/a11y-link.module'

@NgModule({
  declarations: [LinkAccountComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    LinkAccountRoutingModule,
    SignInModule,
    A11yLinkModule,
  ],
})
export class LinkAccountModule {}
