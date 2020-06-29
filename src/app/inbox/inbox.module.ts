import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { InboxRoutingModule } from './inbox-routing.module'
import { InboxComponent } from './pages/inbox/inbox.component'
import { NotificationsComponent } from './components/notifications/notifications.component'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatIconModule } from '@angular/material/icon'
import { NotificationComponent } from './components/notification/notification.component'
import { MatButtonModule } from '@angular/material/button'

@NgModule({
  declarations: [InboxComponent, NotificationsComponent, NotificationComponent],
  imports: [
    CommonModule,
    InboxRoutingModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class InboxModule {}
