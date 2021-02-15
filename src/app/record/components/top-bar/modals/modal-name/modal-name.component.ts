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
import { first } from 'rxjs/operators'
import { cloneDeep } from 'lodash'

@Component({
  selector: 'app-modal-name',
  templateUrl: './modal-name.component.html',
  styleUrls: ['./modal-name.component.scss-theme.scss', './modal-name.component.scss'],
})
export class ModalNameComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  namesForm: FormGroup
  otherNamesForm: FormGroup
  userRecord: UserRecord
  otherNames: Assertion[]
  isMobile: boolean
  defaultVisibility: VisibilityStrings
  addedOtherNameCount = 0
  loadingNames = true
  platform: PlatformInfo

  ngOrcidAddGivenName = $localize`:@@topBar.addGivenName:Add given name`
  ngOrcidAddFamilyName = $localize`:@@topBar.addFamilyName:Add family name`
  ngOrcidAddPublishedName = $localize`:@@topBar.addPublishedName:Add published name`

  constructor(
    private _platform: PlatformInfoService,
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserRecord,
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
  }

  ngOnInit(): void {
    this.userRecord = this.data
    this.otherNames = this.userRecord.otherNames.otherNames

    this.namesForm = new FormGroup({
      givenNames: new FormControl('', {}),
      familyName: new FormControl('', {}),
      publishedName: new FormControl('', {}),
      visibility: new FormControl('', {}),
    })

    this._recordNameService
      .getNames()
      .pipe(first())
      .subscribe((names: NamesEndPoint) => {
        this.defaultVisibility = names.visibility.visibility
        this._recordOtherNamesService
          .getOtherNames()
          .pipe(first())
          .subscribe((otherNames: OtherNamesEndPoint) => {
            const originalBackendOtherNames = cloneDeep(otherNames)
            const otherNamesMap = {}
            originalBackendOtherNames.otherNames.map(
              (value) => (otherNamesMap[value.putCode] = value)
            )
            this.backendJsonToForm(names, originalBackendOtherNames)
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
        visibility: new FormControl(otherName.visibility, {}),
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

  saveEvent() {
    this.loadingNames = true
    this._recordNameService
      .postNames(this.formToBackendNames(this.namesForm))
      .subscribe((response) => {
        console.log(response)
        this.closeEvent()
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
        otherNames: new FormControl(),
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
