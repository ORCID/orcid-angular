import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core'
import { Assertion } from '../../../../types'
import { UserService } from '../../../../core'
import { WINDOW } from '../../../window'
import { FormControl, FormGroup } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatSelect } from '@angular/material/select'
import { cloneDeep } from 'lodash'
import { Subject } from 'rxjs'
import { first, takeUntil } from 'rxjs/operators'
import { ModalComponent } from 'src/app/cdk/modal/modal/modal.component'
import { UserSession } from 'src/app/types/session.local'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { RecordKeywordService } from 'src/app/core/record-keyword/record-keyword.service'
import { UserRecord } from 'src/app/types/record.local'
import { VisibilityStrings } from 'src/app/types/common.endpoint'
import { KeywordEndPoint } from 'src/app/types/record-keyword.endpoint'

@Component({
  selector: 'app-modal-keyword',
  templateUrl: './modal-keyword.component.html',
  styleUrls: [
    './modal-keyword.component.scss-theme.scss',
    './modal-keyword.component.scss',
  ],
})
export class ModalKeywordComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  addedKeywordsCount = 0
  userRecord: UserRecord
  keywordsForm: FormGroup
  keywords: Assertion[]
  defaultVisibility: VisibilityStrings
  originalBackendKeywords: KeywordEndPoint
  isMobile: boolean
  loadingKeywords = true
  userSession: UserSession
  platform: PlatformInfo

  ngOrcidKeyword = $localize`:@@topBar.keyword:Keyword Title`

  constructor(
    @Inject(WINDOW) private window: Window,
    @Inject(MAT_DIALOG_DATA) public data: UserRecord,
    public dialogRef: MatDialogRef<ModalComponent>,
    private _recordKeywordService: RecordKeywordService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _platform: PlatformInfoService,
    private _userService: UserService
  ) {
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.platform = platform
        this.isMobile = platform.columns4 || platform.columns8
      })
    this._userService
      .getUserSession()
      .pipe(takeUntil(this.$destroy))
      .subscribe((userSession) => {
        this.userSession = userSession
      })
  }

  ngOnInit(): void {
    this._recordKeywordService
      .getKeywords()
      .pipe(first())
      .subscribe((keywords: KeywordEndPoint) => {
        this.defaultVisibility = keywords.visibility.visibility
        this.originalBackendKeywords = cloneDeep(keywords)
        this.keywords = this.originalBackendKeywords.keywords
        this.backendJsonToForm(this.originalBackendKeywords)
        this.loadingKeywords = false
      })
  }

  backendJsonToForm(keywordEndpointJson: KeywordEndPoint) {
    const keywords = keywordEndpointJson.keywords
    const group: { [key: string]: FormGroup } = {}

    keywords.forEach((keyword) => {
      group[keyword.putCode] = new FormGroup({
        content: new FormControl(keyword.content),
        visibility: new FormControl(keyword.visibility.visibility, {}),
      })
    })
    this.keywordsForm = new FormGroup(group)
  }

  formToBackend(keywordsForm: FormGroup): KeywordEndPoint {
    const keywords = {
      errors: [],
      keywords: [],
      visibility: this.originalBackendKeywords.visibility,
    }
    const toBackendKeywords = cloneDeep(this.keywords)
    toBackendKeywords.reverse()
    toBackendKeywords
      .map((value) => value.putCode)
      .filter((key) => keywordsForm.value[key].content)
      .forEach((key, i) => {
        const content = keywordsForm.value[key].content
        const visibility = keywordsForm.value[key].visibility
        if (keywordsForm.value[key]) {
          keywords.keywords.push({
            putCode: key.indexOf('new-') === 0 ? null : key,
            content: content,
            displayIndex: i + 1,
            source: this.userSession.userInfo.EFFECTIVE_USER_ORCID,
            visibility: {
              visibility,
            },
          } as Assertion)
        }
      })
    return keywords
  }

  saveEvent() {
    this.loadingKeywords = true
    this._recordKeywordService
      .postKeywords(this.formToBackend(this.keywordsForm))
      .subscribe((response) => {
        this.closeEvent()
      })
  }

  closeEvent() {
    this.dialogRef.close()
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.keywords, event.previousIndex, event.currentIndex)
  }

  addKeyword() {
    this.keywordsForm.addControl(
      'new-' + this.addedKeywordsCount,
      new FormGroup({
        content: new FormControl(),
        visibility: new FormControl(this.defaultVisibility, {}),
      })
    )
    this.keywords.push({
      putCode: 'new-' + this.addedKeywordsCount,
      visibility: { visibility: this.defaultVisibility },
    } as Assertion)
    this.addedKeywordsCount++

    this._changeDetectorRef.detectChanges()
  }

  deleteKeyword(putcode: string) {
    const i = this.keywords.findIndex((value) => value.putCode === putcode)
    this.keywords.splice(i, 1)
    this.keywordsForm.removeControl(putcode)
  }

  getSourceName(keyword: Assertion) {
    return keyword.sourceName || keyword.source
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }

  toMyKeywords() {
    this.window.document.getElementById('my-keywords').scrollIntoView()
  }

  onSubmit() {}
}
