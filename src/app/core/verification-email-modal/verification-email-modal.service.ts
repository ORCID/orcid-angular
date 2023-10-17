import { Injectable } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { PlatformInfoService } from '../../cdk/platform-info'
import { first } from 'rxjs/operators'
import { TopBarVerificationEmailModalComponent } from 'src/app/cdk/top-bar-verification-email/modals/top-bar-verification-email-modal/top-bar-verification-email-modal.component'

@Injectable({
  providedIn: 'root',
})
export class VerificationEmailModalService {
  constructor(
    private _dialog: MatDialog,
    private _platform: PlatformInfoService
  ) {}

  alreadyOpenVerificacionModal = false

  openVerificationEmailModal(primaryEmail: string) {
    this._platform
      .get()
      .pipe(first())
      .subscribe((platform) => {
        if (!this.alreadyOpenVerificacionModal) {
          this.alreadyOpenVerificacionModal = true
          const modalComponent = this._dialog.open(
            TopBarVerificationEmailModalComponent,
            {
              width: '850px',
              maxWidth: platform.tabletOrHandset ? '99%' : '80vw',
            }
          )
          modalComponent.componentInstance.primaryEmail = primaryEmail

          modalComponent
            .afterClosed()
            .subscribe((x) => (this.alreadyOpenVerificacionModal = false))
        }
      })
  }
}
