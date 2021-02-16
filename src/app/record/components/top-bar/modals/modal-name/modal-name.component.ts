import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { OrcidValidators } from '../../../../../validators'
import { ILLEGAL_NAME_CHARACTERS_REGEXP, URL_REGEXP } from '../../../../../constants'
import { UserRecord } from '../../../../../types/record.local'
import { RecordNamesService } from '../../../../../core/record-names/record-names.service'
import { RecordOtherNamesService } from '../../../../../core/record-other-names/record-other-names.service'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { Subject } from 'rxjs'
import { PlatformInfo, PlatformInfoService } from '../../../../../cdk/platform-info'
import { Visibility, VisibilityStrings } from '../../../../../types/common.endpoint'
import { Assertion } from '../../../../../types'
import { NamesEndPoint } from '../../../../../types/record-name.endpoint'
import { OtherNamesEndPoint } from '../../../../../types/record-other-names.endpoint'
import { first, takeUntil } from 'rxjs/operators'
import { cloneDeep } from 'lodash'
import { UserSession } from '../../../../../types/session.local'
import { UserService } from '../../../../../core'

@Component({
  selector: 'app-modal-name',
  templateUrl: './modal-name.component.html',
  styleUrls: ['./modal-name.component.scss-theme.scss', './modal-name.component.scss'],
})
export class ModalNameComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  platform: PlatformInfo
  namesForm: FormGroup
  otherNamesForm: FormGroup
  userRecord: UserRecord
  userSession: UserSession
  otherNames: Assertion[]
  originalBackendOtherNames: OtherNamesEndPoint
  isMobile: boolean
  defaultVisibility: VisibilityStrings
  addedOtherNameCount = 0
  loadingNames = true

  ngOrcidAddGivenName = $localize`:@@topBar.addGivenName:Add given name`
  ngOrcidAddFamilyName = $localize`:@@topBar.addFamilyName:Add family name`
  ngOrcidAddPublishedName = $localize`:@@topBar.addPublishedName:Add published name`

  constructor(
    private _platform: PlatformInfoService,
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserRecord,
    private _userService: UserService,
    private _recordNameService: RecordNamesService,
    private _recordOtherNamesService: RecordOtherNamesService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this._platform
      .get()
      .subscribe(
        (platform) => {
          this.platform = platform
          this.isMobile = platform.columns4 || platform.columns8
        },
      )

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
            this.otherNames = this.userRecord.otherNames.otherNames
            const otherNamesMap = {}
            this.originalBackendOtherNames.otherNames.map(
              (value) => (otherNamesMap[value.putCode] = value)
            )
            this.backendJsonToForm(names, this.originalBackendOtherNames)
            this.loadingNames = false
          })
      })
  }

  onSubmit() {
  }

  backendJsonToForm(namesEndPoint: NamesEndPoint, otherNamesEndpointJson: OtherNamesEndPoint) {
    const otherNames = otherNamesEndpointJson.otherNames
    const group: { [key: string]: FormGroup } = {}

    otherNames.forEach((otherName) => {
      group[otherName.putCode] = new FormGroup({
        otherName: new FormControl(otherName.content),
        visibility: new FormControl(otherName.visibility.visibility, {}),
      })
    })
    this.namesForm = new FormGroup(group)

    const givenNames = namesEndPoint.givenNames ? namesEndPoint.givenNames.value : ''
    const familyName = namesEndPoint.familyName ? namesEndPoint.familyName.value : ''
    const publishedName = namesEndPoint.creditName ? namesEndPoint.creditName.value : ''
    const visibilityName = namesEndPoint.visibility.visibility

    this.namesForm.addControl('givenNames', new FormControl(givenNames, {
      validators: [
        Validators.required,
        OrcidValidators.notPattern(ILLEGAL_NAME_CHARACTERS_REGEXP),
        OrcidValidators.notPattern(URL_REGEXP),
      ],
    }))
    this.namesForm.addControl('familyName', new FormControl(familyName, {
      validators: [
        OrcidValidators.notPattern(URL_REGEXP),
        OrcidValidators.notPattern(ILLEGAL_NAME_CHARACTERS_REGEXP),
      ],
    }))
    this.namesForm.addControl('publishedName', new FormControl(publishedName, {}))
    this.namesForm.addControl('visibility', new FormControl(visibilityName, {}))
  }

  formToBackendNames(namesForm: FormGroup): any {
    const visibility = {
      errors: [],
      required: undefined,
      visibility: namesForm.get('visibility').value,
    } as Visibility
    return {
      errors: [],
      givenNames: namesForm.get('givenNames').value,
      familyName: namesForm.get('familyName').value,
      creditName: namesForm.get('publishedName').value,
      visibility: visibility,
    } as NamesEndPoint
  }

  formToBackendOtherNames(namesForm: FormGroup): OtherNamesEndPoint {
    const otherNames = {
      errors: [],
      otherNames: [],
      visibility: this.originalBackendOtherNames.visibility,
    }
    this.otherNames.reverse()
    this.otherNames
      .map((value) => value.putCode)
      .filter((key) => namesForm.value[key].otherName)
      .forEach((key, i) => {
        const otherName = namesForm.value[key].otherName
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
    this.loadingNames = true
    this._recordNameService
      .postNames(this.formToBackendNames(this.namesForm))
      .subscribe((response) => {
        console.log(response)
        this._recordOtherNamesService
          .postOtherNames(this.formToBackendOtherNames(this.namesForm))
          .subscribe((res) => {
            console.log(res)
            this.closeEvent()
            }
          )
      }, error => {
        console.log(error)
      })
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
        visibility: new FormControl(this.defaultVisibility, {}),
      }),
    )
    this.otherNames.push({
      putCode: 'new-' + this.addedOtherNameCount,
      visibility: { visibility: this.defaultVisibility },
    } as Assertion)
    this.addedOtherNameCount++

    this._changeDetectorRef.detectChanges()
  }

  deleteOtherName(putCode: string) {
    const i = this.otherNames.findIndex((value) => value.putCode === putCode)
    this.otherNames.splice(i, 1)
    this.namesForm.removeControl(putCode)
  }

  getSourceName(names: Assertion) {
    if (names.sourceName) {
      if (names.lastModified) {
        return names.sourceName + ' ' + names.lastModified.year + '-' + names.lastModified.month + '-' + names.lastModified.day
      } else {
        return names.sourceName
      }
    }
  }

  toGivenNames() {
    document.getElementById('given-names').scrollIntoView()
  }

  toPublishedName() {
    document.getElementById('published-name').scrollIntoView()
  }

  toVisibility() {
    document.getElementById('visibility').scrollIntoView()
  }

  toAlsoKnownAs() {
    document.getElementById('also-known-as').scrollIntoView()
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
