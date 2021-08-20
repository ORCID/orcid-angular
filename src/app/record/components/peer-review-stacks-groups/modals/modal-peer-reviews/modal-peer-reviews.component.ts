import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { Subject } from 'rxjs'
import { RecordPeerReviewService } from '../../../../../core/record-peer-review/record-peer-review.service'
import { first } from 'rxjs/operators'
import { RecordImportWizard } from '../../../../../types/record-peer-review-import.endpoint'
import { environment } from '../../../../../../environments/environment'

@Component({
  selector: 'app-modal-peer-reviews',
  templateUrl: './modal-peer-reviews.component.html',
  styleUrls: ['./modal-peer-reviews.component.scss'],
})
export class ModalPeerReviewsComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  loadingPeerReviews = true
  recordImportWizards: RecordImportWizard[]

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _recordPeerReviewService: RecordPeerReviewService
  ) {}

  ngOnInit(): void {
    this._recordPeerReviewService
      .getPeerReviewImportWizardList()
      .pipe(first())
      .subscribe((data) => {
        this.recordImportWizards = data
        this.loadingPeerReviews = false
      })
  }

  openImportWizardUrlFilter(client): string {
    if (client.status === 'RETIRED') {
      return client.clientWebsite;
    } else {
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
  }

  toggle(recordImportWizard: RecordImportWizard) {
    recordImportWizard.show = !recordImportWizard.show
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
