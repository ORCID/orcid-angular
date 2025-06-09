import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core'
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog'
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
  @ViewChildren('nameInput') inputs: QueryList<ElementRef>
  $destroy: Subject<boolean> = new Subject<boolean>()

  id: string
  platform: PlatformInfo
  namesForm: UntypedFormGroup
  otherNamesForm: UntypedFormGroup
  userRecord: UserRecord
  userSession: UserSession
  otherNames: Assertion[]
  originalBackendOtherNames: OtherNamesEndPoint
  isMobile: boolean
  defaultVisibility: VisibilityStrings
  publicVisibility: VisibilityStrings
  otherNamesDefaultVisibility: VisibilityStrings
  addedOtherNameCount = 0
  loadingNames = true
  nameMaxLength = 99
  otherNameMaxLength = 254

  ngOrcidAddGivenName = $localize`:@@topBar.addGivenName:Your given names or forenames`
  ngOrcidAddFamilyName = $localize`:@@topBar.addFamilyName:Your family names or surnames`
  ngOrcidAddPublishedName = $localize`:@@topBar.addPublishedName:Add a published or credit name`
  ngOrcidAddOtherName = $localize`:@@topBar.addOtherName:Add other name`
  ngOrcidDefaultVisibilityLabel = $localize`:@@topBar.manageWhoCanSee:Control who can see your given, family and published names by setting the visibility. The default visibility for your names is`
  closeAriaLabel = $localize`:@@topBar.ariaLabelCloseNames:Close Names`
  saveAriaLabel = $localize`:@@topBar.ariaLabelSaveChanges:Save changes to Names`
  cancelAriaLabel = $localize`:@@topBar.ariaLabelCancelChanges:Cancel changes and close Names`
  inputGivenNamesAriaLabel = $localize`:@@topBar.ariaLabelYourGivenNames:Your given names`
  inputFamilyNamesAriaLabel = $localize`:@@topBar.ariaLabelYourFamilyNames:Your family names`
  inputPublishedNamesAriaLabel = $localize`:@@topBar.ariaLabelYourPublishedNames:Your published names`
  inputAlsoKnownAsAriaLabel = $localize`:@@topBar.ariaLabelIAmAlsoKnownAs:I am also known as`
  visibilityNamesPublicAriaLabel = $localize`:@@topBar.ariaLabelNamesPublic:Set names visibility to Everyone`
  visibilityNamesTrustedPartyAriaLabel = $localize`:@@topBar.ariaLabelNamesTrustedParties:Set names visibility to Trusted Parties`
  visibilityNamesPrivateAriaLabel = $localize`:@@topBar.ariaLabelNamesPrivate:Set names visibility to Only Me`
  visibilityOtherNamesPublicAriaLabel = $localize`:@@topBar.ariaLabelOtherNamesPublic:Set other names visibility to Everyone`
  visibilityOtherNamesTrustedPartyAriaLabel = $localize`:@@topBar.ariaLabelOtherNamesTrustedParty:Set other names visibility to Trusted Parties`
  visibilityOtherNamesPrivateAriaLabel = $localize`:@@topBar.ariaLabelOtherNamesPrivate:Set other names visibility to Only Me`
  deleteOtherNameAriaLabel = $localize`:@@topBar.ariaLabelDeleteOtherName:Delete other name`

  ariaLabelYourNames = $localize`:@@topBar.yourNames:Your names`

  constructor(
    @Inject(WINDOW) private window: Window,
    private _platform: PlatformInfoService,
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserRecord,
    private _userService: UserService,
    private _recordNameService: RecordNamesService,
    private _recordOtherNamesService: RecordOtherNamesService,
    private _changeDetectorRef: ChangeDetectorRef,
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
    this.publicVisibility = 'PUBLIC'
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
    const group: { [key: string]: UntypedFormGroup } = {}

    otherNames.forEach((otherName) => {
      group[otherName.putCode] = new UntypedFormGroup({
        otherName: new UntypedFormControl(
          {
            value: otherName.content,
            disabled: otherName.source !== this.id,
          },
          [Validators.maxLength(this.otherNameMaxLength)]
        ),
        visibility: new UntypedFormControl(otherName.visibility.visibility, {}),
      })
    })
    this.namesForm = new UntypedFormGroup(group)

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
      new UntypedFormControl(givenNames, {
        validators: [
          Validators.required,
          OrcidValidators.illegalName,
          Validators.maxLength(this.nameMaxLength),
        ],
      })
    )
    this.namesForm.addControl(
      'familyName',
      new UntypedFormControl(familyName, {
        validators: [
          OrcidValidators.illegalName,
          Validators.maxLength(this.nameMaxLength),
        ],
      })
    )
    this.namesForm.addControl(
      'publishedName',
      new UntypedFormControl(publishedName, {
        validators: [Validators.maxLength(this.nameMaxLength)],
      })
    )
    this.namesForm.addControl(
      'visibility',
      new UntypedFormControl(visibilityName, {})
    )
  }

  formToBackendNames(namesForm: UntypedFormGroup): any {
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

  formToBackendOtherNames(namesForm: UntypedFormGroup): OtherNamesEndPoint {
    const otherNames = {
      errors: [],
      otherNames: [],
      visibility: this.originalBackendOtherNames.visibility,
    }
    this._changeDetectorRef.detach()
    this.otherNames.reverse()
    this.otherNames
      .map((value) => value.putCode)
      .filter((key) => namesForm.getRawValue()[key].otherName)
      .forEach((key, i) => {
        const otherName = namesForm.getRawValue()[key].otherName.trim()
        const visibility = namesForm.getRawValue()[key].visibility
        if (namesForm.getRawValue()[key]) {
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
            this._userService.refreshUserSession(true).pipe(take(1))
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
      new UntypedFormGroup({
        otherName: new UntypedFormControl('', [
          Validators.maxLength(this.otherNameMaxLength),
        ]),
        visibility: new UntypedFormControl(this.otherNamesDefaultVisibility),
      })
    )
    this.otherNames.push({
      putCode: 'new-' + this.addedOtherNameCount,
      visibility: { visibility: this.otherNamesDefaultVisibility },
    } as Assertion)
    this.addedOtherNameCount++

    this._changeDetectorRef.detectChanges()
    const input = this.inputs.last
    input.nativeElement.focus()
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
