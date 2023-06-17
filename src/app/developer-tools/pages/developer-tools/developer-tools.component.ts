import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { log } from 'console'
import { MAX_LENGTH_LESS_THAN_ONE_THOUSAND } from 'src/app/constants'
import { URL_REGEXP_BACKEND } from 'src/app/constants'
import { UserService } from 'src/app/core'
import { DeveloperToolsService } from 'src/app/core/developer-tools/developer-tools.service'
import { UserInfoService } from 'src/app/core/user-info/user-info.service'
import { UserInfo } from 'src/app/types'
import { Client } from 'src/app/types/developer-tools'
import { ClientSecretModalComponent } from '../../components/client-secret-modal/client-secret-modal.component'
import { map, switchMap, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs'
import { Empty } from '@angular-devkit/core/src/virtual-fs/host'

@Component({
  selector: 'app-developer-tools',
  templateUrl: './developer-tools.component.html',
  styleUrls: [
    './developer-tools.component.scss',
    './developer-tools.component.scss-theme.scss',
  ],
})
export class DeveloperToolsComponent implements OnInit {
  formWasSummited = false
  ariaLabelDelete = $localize`:@@xxxx.ariaLabelWebsiteDelete:Delete URI`
  labelAuthorizeRequest = $localize`:@@xxxx.labelAuthorizeRequest:Authorize request`
  labelTokenRequest = $localize`:@@xxxx.labelTokenRequest:Token request`
  labelOpenIdImplicitRequest = $localize`:@@xxxx.labelOpenIdImplicitRequest:OpenID/Implicit request`
  authRequest = true
  checked
  form: FormGroup
  developerToolsEnable: any
  triedToSaveWithoutUrls: boolean
  loading: boolean
  existingClient: Client
  constructor(
    private fb: FormBuilder,
    private userInfo: UserInfoService,
    private developerToolsService: DeveloperToolsService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
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
        currentClient = null
        this.existingClient = currentClient
        this.form = this.fb.group({
          displayName: [currentClient?.displayName?.value, Validators.required],
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
          redirectUris: this.fb.array([], this.ValidatorAtLeastOne()),
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

  save() {
    this.formWasSummited = true

    this.triedToSaveWithoutUrls = (
      this.form.get('redirectUris').value as string[]
    ).some((uri) => !uri)
    this.form.markAllAsTouched()
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
          console.log(res)
        })
    } else {
      this.developerToolsService
        .postDeveloperToolsClient(devToolsClient)
        .subscribe((res) => {
          console.log(res)
        })
    }
  }
  ValidatorAtLeastOne(): ValidatorFn {
    return (control: FormArray) => {
      const forbidden = control.length === 0
      return forbidden ? { forbiddenLength: { value: control.value } } : null
    }
  }
  getDeveloperToolsEnableState(): Observable<boolean> {
    this.loading = true
    return this.userInfo.getUserInfo().pipe(
      map((user) => {
        this.developerToolsEnable = user['DEVELOPER_TOOLS_ENABLED'] === 'true2'
        this.loading = false
        return this.developerToolsEnable
      })
    )
  }

  get redirectUris() {
    console.log(this.form.get('redirectUris'))
    return this.form.get('redirectUris') as FormArray
  }

  addRedirectUri() {
    const fc = new FormControl('', [
      Validators.required,
      Validators.pattern(URL_REGEXP_BACKEND),
    ])
    fc.valueChanges.subscribe((value) => {
      console.log(value)
      console.log(this.form.errors)
    })
    this.redirectUris.push(fc)
  }

  removeRedirectUri(index: number) {
    this.redirectUris.removeAt(index)
  }
  expandedClicked(event) {
    console.log(event)
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
