import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { first } from 'rxjs/operators'
import { ComponentType } from '@angular/cdk/portal'
import { MatDialog } from '@angular/material/dialog'
import { PlatformInfoService } from '../../platform-info'
import { SortData, SortOrderDirection, SortOrderType } from 'src/app/types/sort'
import { ADD_EVENT_ACTION, EXTERNAL_ID_TYPE_WORK } from 'src/app/constants'
import { ModalAffiliationsComponent } from '../../../record/components/affiliation-stacks-groups/modals/modal-affiliations/modal-affiliations.component'
import { ModalFundingComponent } from '../../../record/components/funding-stacks-groups/modals/modal-funding/modal-funding.component'
import { AffiliationType } from 'src/app/types/record-affiliation.endpoint'
import { ModalPeerReviewsComponent } from '../../../record/components/peer-review-stacks-groups/modals/modal-peer-reviews/modal-peer-reviews.component'
import { ModalFundingSearchLinkComponent } from '../../../record/components/funding-stacks-groups/modals/modal-funding-search-link/modal-funding-search-link.component'
import { ModalWorksSearchLinkComponent } from '../../../record/components/work-stack-group/modals/work-search-link-modal/modal-works-search-link.component'

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
  @Input() selectable = false
  @Output() expanded: EventEmitter<any> = new EventEmitter()
  @Input() sortTypes: SortOrderType[] = ['title', 'start', 'end']
  @Input() sortType: SortOrderType = 'end'
  @Input() sortDirection: SortOrderDirection = 'desc'
  @Input() defaultDirection: SortOrderDirection = 'asc'

  @Output() sort: EventEmitter<SortData> = new EventEmitter()
  @Output() addEvent: EventEmitter<ADD_EVENT_ACTION> = new EventEmitter()

  @Input() addMenuOptions: {
    action: ADD_EVENT_ACTION
    label: string
    modal?: ComponentType<any>
    type?: EXTERNAL_ID_TYPE_WORK
  }[] = []

  @Input() labelAddButton = $localize`:@@shared.sortItems:Sort Items`
  @Input() labelExportButton = $localize`:@@shared.exportItems:Export Items`
  @Input() labelSortButton = $localize`:@@shared.addItem:Add Item`

  constructor(
    private _dialog: MatDialog,
    private _platform: PlatformInfoService
  ) {}

  add(type: string, action?: ADD_EVENT_ACTION) {
    const menuOption = this.addMenuOptions.find((x) => x.action === action)
    if (menuOption && menuOption.modal) {
      this.openModal(menuOption.modal, menuOption.type)
    } else {
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
        case 'funding':
          this.openModal(ModalFundingComponent)
          break
        case 'funding-search':
          this.openModal(ModalFundingSearchLinkComponent)
          break
        case 'works-search':
          this.openModal(ModalWorksSearchLinkComponent)
          break
        default:
          break
      }
    }
  }

  openModal(modal: ComponentType<any>, type?: string | AffiliationType | EXTERNAL_ID_TYPE_WORK) {
    this._platform
      .get()
      .pipe(first())
      .subscribe((platform) => {
        let modalComponent
        modalComponent = this._dialog.open(modal, {
          width: '850px',
          maxWidth: platform.tabletOrHandset ? '95vw' : '80vw',
        })

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

  multipleMatButton() {
    return (
      this.type === 'education' ||
      this.type === 'invited-position' ||
      this.type === 'membership' ||
      this.type === 'funding' ||
      this.type === 'works' ||
      this.type === 'peer-review'
    )
  }

  singleAddButton() {
    return this.type === 'employment'
  }

  ngOnInit(): void {}
}
