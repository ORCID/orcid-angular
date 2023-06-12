import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { log } from 'console'
import { MAX_LENGTH_LESS_THAN_ONE_THOUSAND } from 'src/app/constants'
import { URL_REGEXP_BACKEND } from 'src/app/constants'
import { UserService } from 'src/app/core'
import { DeveloperToolsService } from 'src/app/core/developer-tools/developer-tools.service'
import { UserInfoService } from 'src/app/core/user-info/user-info.service'
import { UserInfo } from 'src/app/types'
import { Client } from 'src/app/types/developer-tools'

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
    private developerToolsService: DeveloperToolsService
  ) {}

  ngOnInit(): void {
    this.developerToolsService.getDeveloperToolsClient().subscribe((res) => {
      this.existingClient = res
      this.form = this.fb.group({
        displayName: [res.displayName.value, Validators.required],
        website: [
          res.website.value,
          [Validators.required, Validators.pattern(URL_REGEXP_BACKEND)],
        ],
        shortDescription: [
          res.shortDescription.value,
          [
            Validators.maxLength(MAX_LENGTH_LESS_THAN_ONE_THOUSAND),
            Validators.required,
          ],
        ],
        redirectUris: this.fb.array([], this.ValidatorAtLeastOne()),
      })

      res.redirectUris.forEach((uri) => {
        this.redirectUris.push(
          this.fb.control(uri.value.value, [
            Validators.required,
            Validators.pattern(URL_REGEXP_BACKEND),
          ])
        )
      })
    })

    this.refreshUserInfo()
  }

  save() {
    this.formWasSummited = true
    this.triedToSaveWithoutUrls = true
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
      clientId: this.existingClient.clientId,

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
  refreshUserInfo() {
    this.loading = true
    this.userInfo.getUserInfo().subscribe((user) => {
      this.developerToolsEnable = user['DEVELOPER_TOOLS_ENABLED'] === 'true'
      this.loading = false
    })
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
}
