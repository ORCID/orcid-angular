import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { first } from 'rxjs/operators'
import { ComponentType } from '@angular/cdk/portal'
import { MatDialog } from '@angular/material/dialog'
import { PlatformInfoService } from '../../platform-info'
import { ModalPeerReviewsComponent } from '../../../record/components/peer-reviews/modals/modal-peer-reviews/modal-peer-reviews.component'
import { SortData, SortOrderDirection, SortOrderType } from 'src/app/types/sort'
import { itemMarginAnimation } from 'src/app/animations'
import { ADD_EVENT_ACTION } from 'src/app/constants'

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
  @Input() sortTypes: SortOrderType[] = ['title', 'start', 'end']
  @Input() sortType: SortOrderType = 'end'
  @Input() sortDirection: SortOrderDirection = 'desc'
  @Input() defaultDirection: SortOrderDirection = 'asc'

  @Output() sort: EventEmitter<SortData> = new EventEmitter()
  @Output() addEvent: EventEmitter<ADD_EVENT_ACTION> = new EventEmitter()

  @Input() addMenuOptions: { action: ADD_EVENT_ACTION; label: string }[] = []

  @Input() labelAddButton = $localize`:@@shared.sortItems:Sort Items`
  @Input() labelSortButton = $localize`:@@shared.addItem:Add Item`

  constructor(
    private _dialog: MatDialog,
    private _platform: PlatformInfoService
  ) {}

  clickAddIcon() {
    if (!this.addMenuOptions.length) {
      this.add()
    }
  }

  add(addEvent?: ADD_EVENT_ACTION) {
    switch (this.type) {
      case 'peer-review':
        this.openModal(ModalPeerReviewsComponent)
        break
      default:
        this.addEvent.emit(addEvent)
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

  sortChange(by: SortOrderType) {
    if (this.sortType === by && this.sortDirection === 'asc') {
      this.sortDirection = 'desc'
    } else if (this.sortType === by && this.sortDirection === 'desc') {
      this.sortDirection = 'asc'
    } else if (this.sortType !== by) {
      this.sortDirection = this.defaultDirection
      this.sortType = by
    }
    this.sort.next({
      direction: this.sortDirection,
      type: this.sortType,
    })
  }
  collapse() {
    this.expandedContent = !this.expandedContent
    this.expanded.emit(this.expandedContent)
  }
  ngOnInit(): void {}
}
