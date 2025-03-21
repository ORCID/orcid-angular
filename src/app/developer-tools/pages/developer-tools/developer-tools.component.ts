import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core'
import { FormControl } from '@angular/forms'
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import {
  MAX_LENGTH_LESS_THAN_ONE_THOUSAND,
  MAX_LENGTH_LESS_THAN_TWO_HUNDRED_FIFTY_FIVE,
  URL_REGEXP,
} from 'src/app/constants'
import { URL_REGEXP_BACKEND } from 'src/app/constants'
import { DeveloperToolsService } from 'src/app/core/developer-tools/developer-tools.service'
import { UserInfoService } from 'src/app/core/user-info/user-info.service'
import { Client } from 'src/app/types/developer-tools'
import { ClientSecretModalComponent } from '../../components/client-secret-modal/client-secret-modal.component'
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators'
import { Observable, Subject, of } from 'rxjs'
import { RecordService } from 'src/app/core/record/record.service'
import { MatLegacyInput as MatInput } from '@angular/material/legacy-input'

import { WINDOW } from 'src/app/cdk/window'
import { PlatformInfoService } from 'src/app/cdk/platform-info'

@Component({
  selector: 'app-developer-tools',
  templateUrl: './developer-tools.component.html',
  styleUrls: [
    './developer-tools.component.scss',
    './developer-tools.component.scss-theme.scss',
  ],
  preserveWhitespaces: true,
})
export class DeveloperToolsComponent implements OnInit, OnDestroy {
  @ViewChildren('websiteInput') inputs: QueryList<MatInput>

  destroy$ = new Subject<boolean>()
  formWasSummited = false
  ariaLabelDelete = $localize`:@@developerTools.ariaLabelWebsiteDelete:Delete redirect URI`
  labelAuthorizeRequest = $localize`:@@developerTools.labelAuthorizeRequest:Authorize request`
  labelTokenRequest = $localize`:@@developerTools.labelTokenRequest:Token request`
  labelOpenIdImplicitRequest = $localize`:@@developerTools.labelOpenIdImplicitRequest:OpenID/Implicit request`
  authRequest = true
  checked
  form: FormGroup
  developerToolsEnable: any
  triedToSaveWithoutUrls: boolean
  loading: boolean
  existingClient: Client
  sucessSave: boolean
  loadingUserDevTolsState: boolean
  baseURL: string
  isMobile: boolean

  @ViewChild('firstInput', { static: false }) firstInput: ElementRef

  constructor(
    private fb: FormBuilder,
    private userInfo: UserInfoService,
    private developerToolsService: DeveloperToolsService,
    private matDialog: MatDialog,
    private recordService: RecordService,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(WINDOW) private window: Window,
    private _platform: PlatformInfoService
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next(true)
    this.destroy$.complete()
  }

  ngOnInit(): void {
    this.setFocusToTheMainDiv()

    this._platform
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
      })

    if (this.window?.location) {
      this.baseURL = this.window.location.origin
    }
    this.getDeveloperToolsEnableState()
      .pipe(
        switchMap((developerToolsEnableState) => {
          if (developerToolsEnableState) {
            return this.developerToolsService.getDeveloperToolsClient()
          } else {
            return of(undefined)
          }
        })
      )
      .subscribe((currentClient) => {
        this.loading = false
        this.existingClient = currentClient
        this.form = this.fb.group({
          displayName: [
            currentClient?.displayName?.value,
            [
              Validators.required,
              Validators.maxLength(MAX_LENGTH_LESS_THAN_TWO_HUNDRED_FIFTY_FIVE),
            ],
          ],
          website: [
            currentClient?.website?.value,
            [Validators.required, Validators.pattern(URL_REGEXP_BACKEND)],
          ],
          shortDescription: [
            currentClient?.shortDescription?.value,
            [
              Validators.maxLength(MAX_LENGTH_LESS_THAN_ONE_THOUSAND),
              Validators.required,
            ],
          ],
          redirectUris: this.fb.array(
            [],
            [this.validatorAtLeastOne(), this.validatorNotDuplicate()]
          ),
        })

        currentClient?.redirectUris?.forEach((uri) => {
          this.redirectUris.push(
            this.fb.control(uri.value.value, [
              Validators.required,
              Validators.pattern(URL_REGEXP_BACKEND),
            ])
          )
        })
      })
  }

  private setFocusToTheMainDiv() {
    if (this.window?.location) {
      this.window.location.href = '/developer-tools' + '#main'
      setTimeout(() => {
        this.window.window.scrollTo(0, 0)
        this.window.history.replaceState(
          {},
          this.window.document.title,
          '/developer-tools'
        )
      })
    }
  }

  save() {
    this.formWasSummited = true

    this.triedToSaveWithoutUrls = (
      this.form.get('redirectUris').value as string[]
    ).some((uri) => !uri)
    this.form.markAllAsTouched()
    if (this.form.invalid) {
      return
    }
    const devToolsClient: Client = {
      allowAutoDeprecate: null,
      authenticationProviderId: null,
      memberId: null,
      memberName: null,
      oboEnabled: null,
      persistentTokenEnabled: null,
      scopes: null,
      type: null,
      userOBOEnabled: null,
      clientId: this.existingClient?.clientId,

      displayName: { value: this.form.get('displayName').value },
      redirectUris: this.form.get('redirectUris').value.map((uri) => {
        return {
          actType: null,
          errors: [],
          geoArea: null,
          scopes: [],
          status: 'OK',
          type: {
            errors: [],
            getRequiredMessage: null,
            required: true,
            value: 'sso-authentication',
          },
          value: { value: uri },
        }
      }),
      shortDescription: { value: this.form.get('shortDescription').value },
      website: { value: this.form.get('website').value },
      errors: [],
    }

    if (this.existingClient?.clientId?.value) {
      this.developerToolsService
        .updateDeveloperToolsClient(devToolsClient)
        .subscribe((res) => {
          this.form.markAsPristine()
          this.sucessSave = true
        })
    } else {
      this.developerToolsService
        .postDeveloperToolsClient(devToolsClient)
        .subscribe((res) => {
          this.ngOnInit()
        })
    }
  }
  validatorAtLeastOne(): ValidatorFn {
    return (control: FormArray) => {
      const forbidden = control.length === 0
      return forbidden ? { forbiddenLength: { value: control.value } } : null
    }
  }

  validatorNotDuplicate(): ValidatorFn {
    return (control: FormArray) => {
      if (control.length > 1) {
        // Checks if there is a duplicate in the array
        const duplicate = control.value.some((uri, index) => {
          return uri && control.value.indexOf(uri) !== index
        })
        return duplicate ? { duplicate: { value: control.value } } : null
      }
    }
  }

  getDeveloperToolsEnableState(): Observable<boolean> {
    this.loading = true
    this.loadingUserDevTolsState = true
    return this.recordService.getRecord({ forceReload: true }).pipe(
      takeUntil(this.destroy$),
      filter((user) => !!user.userInfo),
      map((user) => {
        if (user?.userInfo) {
          this.loadingUserDevTolsState = false
        }
        this.developerToolsEnable =
          user?.userInfo?.['DEVELOPER_TOOLS_ENABLED'] === 'true'

        return this.developerToolsEnable
      })
    )
  }

  get redirectUris() {
    return this.form.get('redirectUris') as FormArray
  }

  addRedirectUri() {
    const fc = new FormControl('', [
      Validators.required,
      Validators.pattern(URL_REGEXP),
    ])
    this.redirectUris.push(fc)
    this._changeDetectorRef.detectChanges()

    const input = (this.inputs.last as any).nativeElement
    input.focus()
  }

  removeRedirectUri(index: number) {
    this.redirectUris.removeAt(index)
    this.redirectUris.markAsDirty()
  }

  onClientSecretUpdated() {
    this.matDialog
      .open(ClientSecretModalComponent, {
        maxWidth: '630px',
        data: { secretId: this.existingClient?.clientSecret?.value },
      })
      .afterClosed()
      .pipe(
        switchMap((value) => {
          if (value) {
            return this.developerToolsService
              .resetClientSecret(this.existingClient)
              .pipe(
                tap(() => {
                  this.ngOnInit()
                })
              )
          } else {
            return of()
          }
        })
      )
      .subscribe()
  }
}
