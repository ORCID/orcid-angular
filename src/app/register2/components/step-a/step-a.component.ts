import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core'

import { Router } from '@angular/router'
import { first } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { ApplicationRoutes } from 'src/app/constants'
import { environment } from 'src/environments/environment'
import { ReactivationLocal } from '../../../types/reactivation.local'
import { BaseStepDirective } from '../BaseStep'
import { RegisterStateService } from '../../register-state.service'
import { RegisterObservabilityService } from '../../register-observability.service'

@Component({
  selector: 'app-step-a',
  templateUrl: './step-a.component.html',
  styleUrls: [
    './step-a.component.scss',
    '../register2.style.scss',
    '../register2.scss-theme.scss',
  ],
  preserveWhitespaces: true,
})
export class StepAComponent
  extends BaseStepDirective
  implements AfterViewInit, OnInit
{
  @ViewChild('firstInput') firstInput: ElementRef

  @Input() reactivation: ReactivationLocal
  nextButtonWasClicked: boolean

  constructor(
    private _platform: PlatformInfoService,
    private _router: Router,
    private _registerStateService: RegisterStateService,
    private _registerObservabilityService: RegisterObservabilityService
  ) {
    super()
  }

  ngOnInit(): void {
  }
  infoSiteBaseUrl = environment.INFO_SITE

  goBack() {
    this._registerStateService.registerStepperButtonClicked('a', 'back')
    this._platform
      .get()
      .pipe(first())
      .subscribe((platform) => {
        if (platform.social) {
          this._router.navigate([ApplicationRoutes.social], {
            queryParams: {
              ...platform.queryParameters,
            },
          })
        } else if (platform.institutional) {
          this._router.navigate([ApplicationRoutes.institutionalLinking], {
            queryParams: {
              ...platform.queryParameters,
            },
          })
        } else {
          this._router.navigate([ApplicationRoutes.signin], {
            queryParams: {
              ...platform.queryParameters,
            },
          })
        }
      })
  }

  ngAfterViewInit(): void {
    // Timeout used to get focus on the first input after the first step loads
    setTimeout(() => {
      this.firstInput.nativeElement.focus()
    }),
      100
  }

  nextButton2() {
    this.nextButtonWasClicked = true
    this._registerStateService.registerStepperButtonClicked('a', 'next')
  }

  signIn() {
    this._registerObservabilityService.signInButtonClicked()
    this._platform
      .get()
      .pipe(first())
      .subscribe((platform) => {
        const params = JSON.parse(JSON.stringify(platform.queryParameters))
        if (params['email']) {
          delete params['email']
        }
        if (params['orcid']) {
          delete params['orcid']
        }

        if (params['show_login']) {
          delete params['show_login']
        }

        this._router.navigate([ApplicationRoutes.signin], {
          queryParams: {
            ...params,
          },
        })
      })
  }

  backButton() {
    this._registerStateService.registerStepperButtonClicked('a', 'back')
  }
}
