import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { InboxRoutingModule } from './inbox-routing.module'
import { InboxComponent } from './pages/inbox/inbox.component'
import { NotificationsComponent } from './components/notifications/notifications.component'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatIconModule } from '@angular/material/icon'
import { NotificationComponent } from './components/notification/notification.component'
import { MatButtonModule } from '@angular/material/button'
import { NotificationYourRecordComponent } from './components/notification-your-record/notification-your-record.component'
import { InfoDropDownModule } from '../cdk/info-drop-down/info-drop-down.module'

@NgModule({
  declarations: [
    InboxComponent,
    NotificationsComponent,
    NotificationComponent,
    NotificationYourRecordComponent,
  ],
  imports: [
    CommonModule,
    InboxRoutingModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    InfoDropDownModule,
  ],
})
export class InboxModule {}
