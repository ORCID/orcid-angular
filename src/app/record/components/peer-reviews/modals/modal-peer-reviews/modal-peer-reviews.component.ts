import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { Subject } from 'rxjs'
import { PlatformInfoService } from '../../../../../cdk/platform-info'
import { RecordPeerReviewService } from '../../../../../core/record-peer-review/record-peer-review.service'
import { first } from 'rxjs/operators'
import { RecordPeerReviewImport } from '../../../../../types/record-peer-review-import.endpoint'
import { environment } from '../../../../../../environments/environment'

@Component({
  selector: 'app-modal-peer-reviews',
  templateUrl: './modal-peer-reviews.component.html',
  styleUrls: ['./modal-peer-reviews.component.scss'],
})
export class ModalPeerReviewsComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  loadingPeerReviews = true
  peerReviewImports: RecordPeerReviewImport[]

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _recordPeerReviewService: RecordPeerReviewService
  ) {}

  ngOnInit(): void {
    this._recordPeerReviewService
      .getPeerReviewImportWizardList()
      .pipe(first())
      .subscribe((data) => {
        this.peerReviewImports = data
        this.loadingPeerReviews = false
      })
  }

  openImportWizardUrlFilter(client): string {
    return (
      environment.BASE_URL +
      'oauth/authorize' +
      '?client_id=' +
      client.id +
      '&response_type=code&scope=' +
      client.scopes +
      '&redirect_uri=' +
      client.redirectUri
    )
  }

  saveEvent() {
    this.loadingPeerReviews = true
  }

  closeEvent() {
    this.dialogRef.close()
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
