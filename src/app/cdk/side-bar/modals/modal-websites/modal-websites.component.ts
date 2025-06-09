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
  AbstractControl,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { cloneDeep } from 'lodash'
import * as _ from 'lodash'
import { Subject } from 'rxjs'
import { first, takeUntil } from 'rxjs/operators'
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'

import { URL_REGEXP } from '../../../../constants'
import { UserService } from '../../../../core'
import { RecordWebsitesService } from '../../../../core/record-websites/record-websites.service'
import { Assertion } from '../../../../types'
import { VisibilityStrings } from '../../../../types/common.endpoint'
import { WebsitesEndPoint } from '../../../../types/record-websites.endpoint'
import { UserSession } from '../../../../types/session.local'
import { ModalComponent } from '../../../modal/modal/modal.component'
import { PlatformInfo, PlatformInfoService } from '../../../platform-info'
import { WINDOW } from '../../../window'
import { OrcidValidators } from 'src/app/validators'

@Component({
  selector: 'app-modal-websites',
  templateUrl: './modal-websites.component.html',
  styleUrls: ['./modal-websites.component.scss'],
})
export class ModalWebsitesComponent implements OnInit, OnDestroy {
  ariaLabelSave = $localize`:@@side-bar.ariaLabelWebsiteSave:Save changes to Websites & social links`
  ariaLabelCancel = $localize`:@@side-bar.ariaLabelWebsiteCancel:Cancel changes to Websites & social links`
  ariaLabelDelete = $localize`:@@side-bar.ariaLabelWebsiteDelete:Delete Websites or social link`
  ariaLabelClose = $localize`:@@side-bar.ariaLabelWebsiteClose:Close Websites and social links`
  ariaLabelTitle = $localize`:@@side-bar.ariaLabelWebsiteTitle:Websites or social link Title`
  ariaLabelURL = $localize`:@@side-bar.ariaLabelWebsiteUrl:Link URL`

  @ViewChildren('descriptionInput') inputs: QueryList<ElementRef>

  $destroy: Subject<boolean> = new Subject<boolean>()

  id: string
  websitesForm: UntypedFormGroup
  platform: PlatformInfo
  defaultVisibility: VisibilityStrings
  websites: Assertion[]
  originalBackendWebsites: WebsitesEndPoint
  userSession: UserSession
  isMobile: boolean
  screenDirection = 'ltr'
  addedWebsiteCount = 0
  loadingWebsites = true
  urlMaxLength = 1999
  urlTitleMaxLength = 354

  ngOrcidDescription = $localize`:@@topBar.description:Link Title`
  ngOrcidUrl = $localize`:@@topBar.url:Link URL`

  constructor(
    @Inject(WINDOW) private window: Window,
    public dialogRef: MatDialogRef<ModalComponent>,
    private _changeDetectorRef: ChangeDetectorRef,
    private _platform: PlatformInfoService,
    private _userService: UserService,
    private _recordWebsitesService: RecordWebsitesService,
    private _snackBar: SnackbarService
  ) {
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.platform = platform
        this.isMobile = platform.columns4 || platform.columns8
        this.screenDirection = platform.screenDirection
      })

    this._userService
      .getUserSession()
      .pipe(takeUntil(this.$destroy))
      .subscribe((userSession) => {
        this.userSession = userSession
      })
  }

  ngOnInit(): void {
    this._recordWebsitesService
      .getWebsites()
      .pipe(first())
      .subscribe((websites: WebsitesEndPoint) => {
        this.defaultVisibility = websites.visibility.visibility
        this.originalBackendWebsites = cloneDeep(websites)
        this.websites = this.originalBackendWebsites.websites
        const websitesMap = {}
        this.originalBackendWebsites.websites.map(
          (value) => (websitesMap[value.putCode] = value)
        )
        this.backendJsonToForm(this.originalBackendWebsites)
        this.loadingWebsites = false
      })
  }

  onSubmit() {}

  backendJsonToForm(websitesEndPoint: WebsitesEndPoint) {
    const websites = websitesEndPoint.websites
    const group: { [key: string]: UntypedFormGroup } = {}

    websites.forEach((website) => {
      group[website.putCode] = new UntypedFormGroup({
        description: new UntypedFormControl(
          website.urlName == null ? '' : website.urlName.trim(),
          {
            validators: [Validators.maxLength(this.urlTitleMaxLength)],
            updateOn: 'change',
          }
        ),
        url: new UntypedFormControl(website.url.value.trim(), {
          validators: [
            Validators.required,
            OrcidValidators.patternAfterTrimming(URL_REGEXP),
            this.allUrlsAreUnique(website.putCode),
            Validators.maxLength(this.urlMaxLength),
          ],
          updateOn: 'change',
        }),
        visibility: new UntypedFormControl(website.visibility.visibility, {}),
      })
    })

    this.websitesForm = new UntypedFormGroup(group)
  }

  formToBackend(websitesForm: UntypedFormGroup): WebsitesEndPoint {
    const websites: WebsitesEndPoint = {
      errors: [],
      websites: [],
      visibility: this.originalBackendWebsites.visibility,
    }
    this._changeDetectorRef.detach()
    this.websites.reverse()
    this.websites
      .map((value) => value.putCode)
      .filter((key) => websitesForm.getRawValue()[key].url)
      .forEach((key, i) => {
        const urlName = websitesForm.getRawValue()[key].description.trim()
        const url = websitesForm.getRawValue()[key].url.trim()
        const visibility = websitesForm.getRawValue()[key].visibility
        if (websitesForm.getRawValue()[key]) {
          websites.websites.push({
            putCode: key.indexOf('new-') === 0 ? null : key,
            url: url,
            urlName: urlName,
            displayIndex: i + 1,
            source: this.userSession.userInfo.EFFECTIVE_USER_ORCID,
            visibility: {
              visibility,
            },
          } as Assertion)
        }
      })
    return websites
  }

  saveEvent() {
    this.websitesForm.markAllAsTouched()
    this.websitesForm.updateValueAndValidity()

    if (this.websitesForm.valid) {
      this.loadingWebsites = true
      this._recordWebsitesService
        .postWebsites(this.formToBackend(this.websitesForm))
        .subscribe(
          () => {
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
    moveItemInArray(this.websites, event.previousIndex, event.currentIndex)
  }

  addWebsite() {
    const newPutCode = 'new-' + this.addedWebsiteCount
    this.websitesForm.addControl(
      newPutCode,
      new UntypedFormGroup({
        description: new UntypedFormControl('', {
          validators: [Validators.maxLength(this.urlTitleMaxLength)],
          updateOn: 'change',
        }),
        url: new UntypedFormControl('', {
          validators: [
            Validators.required,
            OrcidValidators.patternAfterTrimming(URL_REGEXP),
            this.allUrlsAreUnique(newPutCode),
            Validators.maxLength(this.urlMaxLength),
          ],
          updateOn: 'change',
        }),
        visibility: new UntypedFormControl(this.defaultVisibility, {}),
      })
    )
    this.websites.push({
      putCode: 'new-' + this.addedWebsiteCount,
      visibility: { visibility: this.defaultVisibility },
    } as Assertion)
    this.addedWebsiteCount++

    this._changeDetectorRef.detectChanges()
    const input = this.inputs.last
    input.nativeElement.focus()
  }

  deleteWebsite(putCode: string) {
    const i = this.websites.findIndex((value) => value.putCode === putCode)
    this.websites.splice(i, 1)
    this.websitesForm.removeControl(putCode)
  }

  toMyLinks() {
    this.window.document.getElementById('my-links').scrollIntoView()
  }

  allUrlsAreUnique(controlKey): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (
        !_.isUndefined(control.value) &&
        !_.isEmpty(control.value) &&
        this.websitesForm
      ) {
        const formGroup = this.websitesForm
        const formGroupKeysWithDuplicatedValues: string[] =
          this.listDuplicateInputKeys(formGroup)
        this.removeDuplicateErrorFromOtherControls(
          formGroupKeysWithDuplicatedValues,
          formGroup
        )
        if (formGroupKeysWithDuplicatedValues.indexOf(controlKey) >= 0) {
          return {
            duplicated: true,
          }
        }
      }
      return {}
    }
  }

  private listDuplicateInputKeys(formGroup: UntypedFormGroup) {
    const formGroupKeysWithDuplicatedValues: string[] = []

    // Add errors error on duplicated urls
    Object.keys(formGroup.controls).forEach((keyX) => {
      let urlControlX: string = (formGroup.controls[keyX] as UntypedFormGroup)
        .controls['url'].value
      urlControlX = urlControlX.toLowerCase().trim()
      urlControlX = this.removeProtocol(urlControlX)

      Object.keys(formGroup.controls).forEach((keyY) => {
        let urlControlY: string = (formGroup.controls[keyY] as UntypedFormGroup)
          .controls['url'].value
        urlControlY = urlControlY.toLowerCase().trim()
        urlControlY = this.removeProtocol(urlControlY)

        // Only if both controls are not empty
        if (urlControlX && urlControlY) {
          if (urlControlX === urlControlY && keyX !== keyY) {
            formGroupKeysWithDuplicatedValues.push(keyY)
          }
        }
      })
    })

    return formGroupKeysWithDuplicatedValues
  }

  private removeDuplicateErrorFromOtherControls(
    formGroupKeysWithDuplicatedValues: string[],
    websitesForm: UntypedFormGroup = new UntypedFormGroup({})
  ): void {
    Object.keys(websitesForm.controls).forEach((currentControlKey) => {
      const urlControl = (
        websitesForm.controls[currentControlKey] as UntypedFormGroup
      ).controls.url as UntypedFormControl
      if (
        formGroupKeysWithDuplicatedValues.indexOf(currentControlKey) === -1 &&
        urlControl.errors &&
        urlControl.errors['duplicated']
      ) {
        delete urlControl.errors['duplicated']
        urlControl.updateValueAndValidity({ onlySelf: true })
      }
    })
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }

  removeProtocol(urlControlX: string): string {
    let response = urlControlX
    if (urlControlX.indexOf('http://') === 0) {
      response = response.replace('http://', '')
    }
    if (urlControlX.indexOf('https://') === 0) {
      response = response.replace('https://', '')
    }
    return response
  }
}
