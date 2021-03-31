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
import { Subject } from 'rxjs'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../modal/modal/modal.component'
import { PlatformInfo, PlatformInfoService } from '../../../platform-info'
import { RecordWebsitesService } from '../../../../core/record-websites/record-websites.service'
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { VisibilityStrings } from '../../../../types/common.endpoint'
import { WINDOW } from '../../../window'
import { first, takeUntil } from 'rxjs/operators'
import { WebsitesEndPoint } from '../../../../types/record-websites.endpoint'
import { Assertion } from '../../../../types'
import { UserSession } from '../../../../types/session.local'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { cloneDeep } from 'lodash'
import * as _ from 'lodash'
import { UserService } from '../../../../core'
import { URL_REGEXP, URL_REGEXP_BACKEND } from '../../../../constants'

@Component({
  selector: 'app-modal-websites',
  templateUrl: './modal-websites.component.html',
  styleUrls: ['./modal-websites.component.scss'],
})
export class ModalWebsitesComponent implements OnInit, OnDestroy {
  @ViewChildren('descriptionInput') inputs: QueryList<ElementRef>

  $destroy: Subject<boolean> = new Subject<boolean>()

  websitesForm: FormGroup
  platform: PlatformInfo
  defaultVisibility: VisibilityStrings
  websites: Assertion[]
  originalBackendWebsites: WebsitesEndPoint
  userSession: UserSession
  isMobile: boolean
  addedWebsiteCount = 0
  loadingWebsites = true

  ngOrcidDescription = $localize`:@@topBar.description:Link Title`
  ngOrcidUrl = $localize`:@@topBar.url:Link URL`

  constructor(
    @Inject(WINDOW) private window: Window,
    public dialogRef: MatDialogRef<ModalComponent>,
    private _changeDetectorRef: ChangeDetectorRef,
    private _platform: PlatformInfoService,
    private _userService: UserService,
    private _recordWebsitesService: RecordWebsitesService
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
    const group: { [key: string]: FormGroup } = {}

    websites.forEach((website) => {
      group[website.putCode] = new FormGroup({
        description: new FormControl(website.urlName),
        url: new FormControl(website.url.value, {
          validators: [
            Validators.required,
            Validators.pattern(URL_REGEXP_BACKEND),
            this.allUrlsAreUnique(website.putCode),
          ],
          updateOn: 'change',
        }),
        visibility: new FormControl(website.visibility.visibility, {}),
      })
    })
    this.websitesForm = new FormGroup(group)
  }

  formToBackend(websitesForm: FormGroup): WebsitesEndPoint {
    const websites: WebsitesEndPoint = {
      errors: [],
      websites: [],
      visibility: this.originalBackendWebsites.visibility,
    }
    this._changeDetectorRef.detach()
    this.websites.reverse()
    this.websites
      .map((value) => value.putCode)
      .filter((key) => websitesForm.value[key].url)
      .forEach((key, i) => {
        const urlName = websitesForm.value[key].description
        const url = websitesForm.value[key].url
        const visibility = websitesForm.value[key].visibility
        if (websitesForm.value[key]) {
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
    if (this.websitesForm.valid) {
      this.loadingWebsites = true
      this._recordWebsitesService
        .postWebsites(this.formToBackend(this.websitesForm))
        .subscribe(
          () => {
            this.closeEvent()
          },
          (error) => {
            console.log(error)
          }
        )
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
      new FormGroup({
        description: new FormControl(),
        url: new FormControl('', {
          validators: [
            Validators.required,
            Validators.pattern(URL_REGEXP),
            this.allUrlsAreUnique(newPutCode),
          ],
          updateOn: 'change',
        }),
        visibility: new FormControl(this.defaultVisibility, {}),
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

  getSource(website: Assertion) {
    if (website.source) {
      if (website.lastModified) {
        return (
          website.source +
          ' ' +
          website.lastModified.year +
          '-' +
          website.lastModified.month +
          '-' +
          website.lastModified.day
        )
      } else {
        return website.sourceName
      }
    }
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
        const formGroupKeysWithDuplicatedValues: string[] = this.listDuplicateInputKeys(
          formGroup
        )
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

  private listDuplicateInputKeys(formGroup: FormGroup) {
    const formGroupKeysWithDuplicatedValues: string[] = []

    // Add errors error on duplicated urls
    Object.keys(formGroup.controls).forEach((keyX) => {
      const urlControlX = (formGroup.controls[keyX] as FormGroup).controls[
        'url'
      ]
      Object.keys(formGroup.controls).forEach((keyY) => {
        const urlControlY = (formGroup.controls[keyY] as FormGroup).controls[
          'url'
        ]

        // Only if both controls are not empty
        if (urlControlX.value && urlControlY.value) {
          if (urlControlX.value === urlControlY.value && keyX !== keyY) {
            formGroupKeysWithDuplicatedValues.push(keyY)
          }
        }
      })
    })

    return formGroupKeysWithDuplicatedValues
  }

  private removeDuplicateErrorFromOtherControls(
    formGroupKeysWithDuplicatedValues: string[],
    websitesForm: FormGroup = new FormGroup({})
  ): void {
    Object.keys(websitesForm.controls).forEach((currentControlKey) => {
      const urlControl = (websitesForm.controls[currentControlKey] as FormGroup)
        .controls.url as FormControl
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
}
