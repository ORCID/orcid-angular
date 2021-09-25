import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { cloneDeep } from 'lodash'
import { Subject } from 'rxjs'
import { first, switchMap, take, takeUntil } from 'rxjs/operators'
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'

import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import {
  PlatformInfo,
  PlatformInfoService,
} from '../../../../../cdk/platform-info'
import { WINDOW } from '../../../../../cdk/window'
import {
  ILLEGAL_NAME_CHARACTERS_REGEXP,
  URL_REGEXP,
} from '../../../../../constants'
import { UserService } from '../../../../../core'
import { RecordNamesService } from '../../../../../core/record-names/record-names.service'
import { RecordOtherNamesService } from '../../../../../core/record-other-names/record-other-names.service'
import { Assertion } from '../../../../../types'
import { VisibilityStrings } from '../../../../../types/common.endpoint'
import { NamesEndPoint } from '../../../../../types/record-name.endpoint'
import { OtherNamesEndPoint } from '../../../../../types/record-other-names.endpoint'
import { UserRecord } from '../../../../../types/record.local'
import { UserSession } from '../../../../../types/session.local'
import { OrcidValidators } from '../../../../../validators'

@Component({
  selector: 'app-modal-name',
  templateUrl: './modal-name.component.html',
  styleUrls: [
    './modal-name.component.scss-theme.scss',
    './modal-name.component.scss',
  ],
})
export class ModalNameComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  id: string
  platform: PlatformInfo
  namesForm: FormGroup
  otherNamesForm: FormGroup
  userRecord: UserRecord
  userSession: UserSession
  otherNames: Assertion[]
  originalBackendOtherNames: OtherNamesEndPoint
  isMobile: boolean
  defaultVisibility: VisibilityStrings
  otherNamesDefaultVisibility: VisibilityStrings
  addedOtherNameCount = 0
  loadingNames = true
  nameMaxLength = 99

  ngOrcidAddGivenName = $localize`:@@topBar.addGivenName:Add given name`
  ngOrcidAddFamilyName = $localize`:@@topBar.addFamilyName:Add family name`
  ngOrcidAddPublishedName = $localize`:@@topBar.addPublishedName:Add a published or credit name`
  ngOrcidAddOtherName = $localize`:@@topBar.addOtherName:Add other name`

  constructor(
    @Inject(WINDOW) private window: Window,
    private _platform: PlatformInfoService,
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserRecord,
    private _userService: UserService,
    private _recordNameService: RecordNamesService,
    private _recordOtherNamesService: RecordOtherNamesService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _userSession: UserService,
    private _snackBar: SnackbarService
  ) {
    this._platform.get().subscribe((platform) => {
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
    this.userRecord = this.data
    this._recordNameService
      .getNames()
      .pipe(first())
      .subscribe((names: NamesEndPoint) => {
        this.defaultVisibility = names.visibility.visibility
        this._recordOtherNamesService
          .getOtherNames()
          .pipe(first())
          .subscribe((otherNames: OtherNamesEndPoint) => {
            this.originalBackendOtherNames = cloneDeep(otherNames)
            this.otherNamesDefaultVisibility = otherNames.visibility.visibility
            this.otherNames = this.originalBackendOtherNames.otherNames
            const otherNamesMap = {}
            this.originalBackendOtherNames.otherNames.map(
              (value) => (otherNamesMap[value.putCode] = value)
            )
            this.backendJsonToForm(names, this.originalBackendOtherNames)
            this.loadingNames = false
          })
      })
  }

  onSubmit() {}

  backendJsonToForm(
    namesEndPoint: NamesEndPoint,
    otherNamesEndpointJson: OtherNamesEndPoint
  ) {
    const otherNames = otherNamesEndpointJson.otherNames
    const group: { [key: string]: FormGroup } = {}

    otherNames.forEach((otherName) => {
      group[otherName.putCode] = new FormGroup({
        otherName: new FormControl({
          value: otherName.content,
          disabled: otherName.source !== this.id,
        }),
        visibility: new FormControl(otherName.visibility.visibility, {}),
      })
    })
    this.namesForm = new FormGroup(group)

    const givenNames = namesEndPoint.givenNames
      ? namesEndPoint.givenNames.value
      : ''
    const familyName = namesEndPoint.familyName
      ? namesEndPoint.familyName.value
      : ''
    const publishedName = namesEndPoint.creditName
      ? namesEndPoint.creditName.value
      : ''
    const visibilityName = namesEndPoint.visibility.visibility

    this.namesForm.addControl(
      'givenNames',
      new FormControl(givenNames, {
        validators: [
          Validators.required,
          OrcidValidators.notPattern(ILLEGAL_NAME_CHARACTERS_REGEXP),
          OrcidValidators.notPattern(URL_REGEXP),
          Validators.maxLength(this.nameMaxLength),
        ],
      })
    )
    this.namesForm.addControl(
      'familyName',
      new FormControl(familyName, {
        validators: [
          OrcidValidators.notPattern(URL_REGEXP),
          OrcidValidators.notPattern(ILLEGAL_NAME_CHARACTERS_REGEXP),
          Validators.maxLength(this.nameMaxLength),
        ],
      })
    )
    this.namesForm.addControl(
      'publishedName',
      new FormControl(publishedName, {
        validators: [Validators.maxLength(this.nameMaxLength)],
      })
    )
    this.namesForm.addControl('visibility', new FormControl(visibilityName, {}))
  }

  formToBackendNames(namesForm: FormGroup): any {
    const visibility = namesForm.get('visibility').value
    return {
      errors: [],
      givenNames: namesForm.get('givenNames').value.trim(),
      familyName: namesForm.get('familyName').value.trim(),
      creditName: namesForm.get('publishedName').value.trim(),
      visibility: {
        visibility,
      },
    } as NamesEndPoint
  }

  formToBackendOtherNames(namesForm: FormGroup): OtherNamesEndPoint {
    const otherNames = {
      errors: [],
      otherNames: [],
      visibility: this.originalBackendOtherNames.visibility,
    }
    this._changeDetectorRef.detach()
    this.otherNames.reverse()
    this.otherNames
      .map((value) => value.putCode)
      .filter((key) => namesForm.value[key].otherName)
      .forEach((key, i) => {
        const otherName = namesForm.value[key].otherName.trim()
        const visibility = namesForm.value[key].visibility
        if (namesForm.value[key]) {
          otherNames.otherNames.push({
            putCode: key.indexOf('new-') === 0 ? null : key,
            content: otherName,
            displayIndex: i + 1,
            source: this.userSession.userInfo.EFFECTIVE_USER_ORCID,
            visibility: {
              visibility,
            },
          } as Assertion)
        }
      })
    return otherNames
  }

  saveEvent() {
    if (this.namesForm.valid) {
      this.loadingNames = true
      this._recordNameService
        .postNames(this.formToBackendNames(this.namesForm))
        .pipe(
          switchMap((_) =>
            this._recordOtherNamesService.postOtherNames(
              this.formToBackendOtherNames(this.namesForm)
            )
          ),
          switchMap((_) =>
            this._userSession.refreshUserSession(true).pipe(take(1))
          )
        )
        .subscribe(
          (_) => {
            this.closeEvent()
          },
          (error) => {}
        )
    } else {
      this._snackBar.showValidationError()
    }
  }

  closeEvent() {
    this.dialogRef.close()
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.otherNames, event.previousIndex, event.currentIndex)
  }

  addOtherName() {
    this.namesForm.addControl(
      'new-' + this.addedOtherNameCount,
      new FormGroup({
        otherName: new FormControl(),
        visibility: new FormControl(this.otherNamesDefaultVisibility, {}),
      })
    )
    this.otherNames.push({
      putCode: 'new-' + this.addedOtherNameCount,
      visibility: { visibility: this.otherNamesDefaultVisibility },
    } as Assertion)
    this.addedOtherNameCount++

    this._changeDetectorRef.detectChanges()
  }

  deleteOtherName(putCode: string) {
    const i = this.otherNames.findIndex((value) => value.putCode === putCode)
    this.otherNames.splice(i, 1)
    this.namesForm.removeControl(putCode)
  }

  toGivenNames() {
    this.window.document.getElementById('given-names').scrollIntoView()
  }

  toPublishedName() {
    this.window.document.getElementById('published-name').scrollIntoView()
  }

  toVisibility() {
    this.window.document.getElementById('visibility').scrollIntoView()
  }

  toAlsoKnownAs() {
    this.window.document.getElementById('also-known-as').scrollIntoView()
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
