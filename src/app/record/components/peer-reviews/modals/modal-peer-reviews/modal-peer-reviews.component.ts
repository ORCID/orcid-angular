import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { Subject } from 'rxjs'
import { PlatformInfoService } from '../../../../../cdk/platform-info'

@Component({
  selector: 'app-modal-peer-reviews',
  templateUrl: './modal-peer-reviews.component.html',
  styleUrls: ['./modal-peer-reviews.component.scss']
})
export class ModalPeerReviewsComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  loadingPeerReviews = true

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _changeDetectorRef: ChangeDetectorRef,
    private _platform: PlatformInfoService
  ) { }

  ngOnInit(): void {
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
