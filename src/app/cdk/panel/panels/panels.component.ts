import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { first } from 'rxjs/operators'
import { ComponentType } from '@angular/cdk/portal'
import { MatDialog } from '@angular/material/dialog'
import { PlatformInfoService } from '../../platform-info'
import { ModalPeerReviewsComponent } from '../../../record/components/peer-reviews/modals/modal-peer-reviews/modal-peer-reviews.component'

@Component({
  selector: 'app-panels',
  templateUrl: './panels.component.html',
  styleUrls: ['./panels.component.scss', './panels.component.scss-theme.scss'],
})
export class PanelsComponent implements OnInit {
  @Input() expandedContent = true
  @Input() title
  @Input() type:
    | 'works'
    | 'activities'
    | 'peer-review'
    | 'sub-peer-review'
    | 'funding'
    | 'research-resources' = 'activities'
  @Input() currentAmount
  @Input() total
  @Input() isPublicRecord: any = false
  @Input() addModalComponent: ComponentType<any>
  @Output() expanded: EventEmitter<any> = new EventEmitter()
  @Input() labelAddButton = $localize`:@@shared.sortItems:Sort Items`
  @Input() labelSortButton = $localize`:@@shared.addItem:Add Item`

  constructor(
    private _dialog: MatDialog,
    private _platform: PlatformInfoService
  ) {}

  add() {
    switch (this.type) {
      case 'peer-review':
        this.openModal(ModalPeerReviewsComponent)
        break
      default:
        break
    }
  }

  openModal(modal: ComponentType<any>) {
    this._platform
      .get()
      .pipe(first())
      .subscribe((platform) => {
        if (this.addModalComponent) {
          this._dialog.open(modal, {
            width: '850px',
            maxWidth: platform.tabletOrHandset ? '95vw' : '80vw',
          })
        }
      })
  }

  sort() {}
  collapse() {
    this.expandedContent = !this.expandedContent
    this.expanded.emit(this.expandedContent)
  }
  ngOnInit(): void {}
}
