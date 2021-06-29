import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { first } from 'rxjs/operators'
import { ComponentType } from '@angular/cdk/portal'
import { MatDialog } from '@angular/material/dialog'
import { PlatformInfoService } from '../../platform-info'
import { ModalPeerReviewsComponent } from '../../../record/components/peer-reviews/modals/modal-peer-reviews/modal-peer-reviews.component'
import { SortData, SortOrderDirection, SortOrderType } from 'src/app/types/sort'
import { ModalAffiliationsComponent } from '../../../record/components/affiliation-stacks-groups/modals/modal-affiliations/modal-affiliations.component'

@Component({
  selector: 'app-panels',
  templateUrl: './panels.component.html',
  styleUrls: ['./panels.component.scss', './panels.component.scss-theme.scss'],
})
export class PanelsComponent implements OnInit {
  @Input() expandedContent = true
  @Input() title
  @Input() type:
    | 'employment'
    | 'education'
    | 'qualification'
    | 'invited-position'
    | 'distinction'
    | 'membership'
    | 'service'
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
  @Input() labelAddButton = $localize`:@@shared.sortItems:Sort Items`
  @Input() labelSortButton = $localize`:@@shared.addItem:Add Item`

  constructor(
    private _dialog: MatDialog,
    private _platform: PlatformInfoService
  ) {}

  add(type: string) {
    switch (type) {
      case 'employment':
      case 'education':
      case 'qualification':
      case 'invited-position':
      case 'distinction':
      case 'membership':
      case 'service':
        this.openModal(ModalAffiliationsComponent, type)
        break
      case 'peer-review':
        this.openModal(ModalPeerReviewsComponent)
        break
      default:
        break
    }
  }

  openModal(modal: ComponentType<any>, type?: string) {
    this._platform
      .get()
      .pipe(first())
      .subscribe((platform) => {
        let modalComponent
        if (this.addModalComponent) {
          modalComponent = this._dialog.open(modal, {
            width: '850px',
            maxWidth: platform.tabletOrHandset ? '95vw' : '80vw',
          })
        }
        modalComponent.componentInstance.type = type
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

  affiliationMatButton() {
    return (
      this.type === 'education' ||
      this.type === 'invited-position' ||
      this.type === 'membership'
    )
  }

  ngOnInit(): void {}
}
