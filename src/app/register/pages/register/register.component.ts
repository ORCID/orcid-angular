import { StepperSelectionEvent } from '@angular/cdk/stepper'
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { MatStep } from '@angular/material/stepper'
import { Router } from '@angular/router'
import { combineLatest } from 'rxjs'
import { catchError, first, map, switchMap } from 'rxjs/operators'
import { IsThisYouComponent } from 'src/app/cdk/is-this-you'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { isRedirectToTheAuthorizationPage } from 'src/app/constants'
import { UserService } from 'src/app/core'
import { GoogleAnalyticsService } from 'src/app/core/google-analytics/google-analytics.service'
import { RegisterService } from 'src/app/core/register/register.service'
import { RequestInfoForm } from 'src/app/types'
import {
  RegisterConfirmResponse,
  RegisterForm,
} from 'src/app/types/register.endpoint'
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service'
import { ERROR_REPORT } from 'src/app/errors'
import { UserSession } from 'src/app/types/session.local'
import { ThirdPartyAuthData } from 'src/app/types/sign-in-data.endpoint'
import { ReactivationLocal } from '../../../types/reactivation.local'
import { SearchService } from '../../../core/search/search.service'
import { SearchParameters, SearchResults } from 'src/app/types'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, AfterViewInit {
  @ViewChild('lastStep') lastStep: MatStep
  @ViewChild('stepComponentA', { read: ElementRef }) stepComponentA: ElementRef
  @ViewChild('stepComponentB', { read: ElementRef }) stepComponentB: ElementRef
  @ViewChild('stepComponentC', { read: ElementRef }) stepComponentC: ElementRef
  platform: PlatformInfo
  FormGroupStepA: FormGroup
  FormGroupStepB: FormGroup
  FormGroupStepC: FormGroup
  isLinear = true
  personalData: RegisterForm
  backendForm: RegisterForm
  loading = false
  requestInfoForm: RequestInfoForm | null
  thirdPartyAuthData: ThirdPartyAuthData
  reactivation = {
    isReactivation: false,
    reactivationCode: '',
  } as ReactivationLocal

  constructor(
    private _cdref: ChangeDetectorRef,
    private _platformInfo: PlatformInfoService,
    private _formBuilder: FormBuilder,
    private _register: RegisterService,
    private _dialog: MatDialog,
    @Inject(WINDOW) private window: Window,
    private _gtag: GoogleAnalyticsService,
    private _user: UserService,
    private _router: Router,
    private _errorHandler: ErrorHandlerService,
    private _userInfo: UserService,
    private _searchService: SearchService
  ) {
    _platformInfo.get().subscribe((platform) => {
      this.platform = platform
      this.reactivation.isReactivation = this.platform.reactivation
      this.reactivation.reactivationCode = this.platform.reactivationCode
    })
  }
  ngOnInit() {
    this.openDialog({
      'expanded-result': [
        {
          'orcid-id': '0000-0002-1593-2148',
          'given-names': 'asdasd',
          'family-names': 'ASD',
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0001-8513-8188',
          'given-names': 'asd',
          'family-names': 'asd',
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0001-6783-3339',
          'given-names': 'asd',
          'family-names': 'asd',
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0002-5680-4679',
          'given-names': 'asdasd',
          'family-names': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0002-0448-2081',
          'given-names': 'asdasd',
          'family-names': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0003-3485-9588',
          'given-names': 'asdasd',
          'family-names': 'lasdlad',
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0002-1820-3477',
          'given-names': 'asdasd',
          'family-names': 'asodkad',
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0001-5737-0545',
          'given-names': 'asdasd',
          'family-names': 'aoksdo',
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0002-9578-7373',
          'given-names': 'Pedro',
          'family-names': 'Costa',
          'other-name': [
            'PEDRO MIGUEL MACHADO DA COSTA',
            'MyOtherName1',
            'MyOtherName2',
            'MyOtherName3',
            'MyOtherName4',
            'MyOtherName5',
          ],
          email: [
            'pedro.newpublicpage111@mailinator.com',
            'pedro.hello111@mailinator.com',
            'pedro.hello@mailinator.com',
            'pedro.newpublicpage@mailinator.com',
          ],
          'institution-name': [
            'American Association for the Advancement of Science',
            'Danish Society of Cardiology',
            'Example Organization Name',
            'Glasgow Kelvin College',
            'Hospitais da Universidade de Coimbra',
            'Howard Hughes Medical Institute - Harvard Medical School',
            'Molecular Cardiology and Neuromuscular Institute',
            'NASA',
            'ORCID',
            'Shahid Beheshti School of Urmia',
            'Sport Lisboa e Benfica',
            'The University of Edinburgh',
            'University of Lisbon',
            "Victoria Hospital & Children's Hospital",
            'common:name',
            'org name',
            'organization name',
            'this is an organization name',
          ],
        },
        {
          'orcid-id': '0000-0001-7035-0071',
          'given-names': null,
          'family-names': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0002-1785-0007',
          'given-names': null,
          'family-names': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0003-2627-1215',
          'given-names': null,
          'family-names': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0002-6692-0008',
          'given-names': null,
          'family-names': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0001-6453-7892',
          'given-names': null,
          'family-names': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0002-9361-1905',
          'given-names': null,
          'family-names': null,
          'other-name': ['asasdadasd', 'Other Name'],
          email: ['testleoo@mailinator.com', 'l.mendoza@ost.orcid.org'],
          'institution-name': [],
        },
      ],
      'num-found': 15,
    })
    this._register.getRegisterForm().subscribe()

    this.FormGroupStepA = this._formBuilder.group({
      personal: [''],
    })
    this.FormGroupStepB = this._formBuilder.group({
      password: [''],
      sendOrcidNews: [''],
    })
    this.FormGroupStepC = this._formBuilder.group({
      activitiesVisibilityDefault: [''],
      termsOfUse: [''],
      captcha: [''],
    })

    combineLatest([this._userInfo.getUserSession(), this._platformInfo.get()])
      .pipe(
        first(),
        map(([session, platform]) => {
          session = session as UserSession
          platform = platform as PlatformInfo

          // TODO @leomendoza123 move the handle of social/institutional sessions to the user service

          this.thirdPartyAuthData = session.thirdPartyAuthData
          this.requestInfoForm = session.oauthSession

          if (this.thirdPartyAuthData || this.requestInfoForm) {
            this.FormGroupStepA = this.prefillRegisterForm(
              this.requestInfoForm,
              this.thirdPartyAuthData
            )
          }
        })
      )
      .subscribe()
  }

  ngAfterViewInit(): void {
    this._cdref.detectChanges()
  }

  register() {
    this.loading = true
    this.lastStep.interacted = true
    if (
      this.FormGroupStepA.valid &&
      this.FormGroupStepB.valid &&
      this.FormGroupStepC.valid
    ) {
      this._register
        .backendRegisterFormValidate(
          this.FormGroupStepA,
          this.FormGroupStepB,
          this.FormGroupStepC
        )
        .pipe(
          switchMap((validator: RegisterForm) => {
            if (validator.errors.length > 0) {
              // At this point any backend error is unexpected
              this._errorHandler.handleError(
                new Error('registerUnexpectedValidateFail'),
                ERROR_REPORT.REGISTER
              )
            }
            return this._register.register(
              this.FormGroupStepA,
              this.FormGroupStepB,
              this.FormGroupStepC,
              this.reactivation,
              this.requestInfoForm,
              !!this.requestInfoForm // request client service to be update (only when the next navigation wont go outside this app)
            )
          })
        )
        .subscribe((response) => {
          this.loading = false
          if (response.url) {
            this._gtag
              .reportEvent(
                'New-Registration',
                'RegGrowth',
                this.requestInfoForm || 'Website'
              )
              .pipe(
                catchError((err) =>
                  this._errorHandler.handleError(
                    err,
                    ERROR_REPORT.STANDARD_NO_VERBOSE_NO_GA
                  )
                )
              )
              .subscribe(
                () => this.afterRegisterRedirectionHandler(response),
                () => this.afterRegisterRedirectionHandler(response)
              )
          } else {
            this._errorHandler.handleError(
              new Error('registerUnexpectedConfirmation'),
              ERROR_REPORT.REGISTER
            )
          }
        })
    } else {
      this.loading = false
    }
  }

  afterRegisterRedirectionHandler(response: RegisterConfirmResponse) {
    if (isRedirectToTheAuthorizationPage(response)) {
      this._platformInfo
        .get()
        .pipe(first())
        .subscribe((platform) => {
          if (platform.queryParameters.providerId) {
            this.window.location.href = response.url
          } else {
            this._router.navigate(['/oauth/authorize'], {
              queryParams: platform.queryParameters,
            })
          }
        })
    } else {
      this.window.location.href = response.url
    }
  }

  afterStepASubmitted() {
    // Update the personal data object is required after submit since is an input for StepB

    if (this.FormGroupStepA.valid) {
      this.personalData = this.FormGroupStepA.value.personal
      const searchValue =
        this.personalData.familyNames.value +
        ' ' +
        this.personalData.givenNames.value
      const searchParams: SearchParameters = {}
      searchParams.searchQuery = searchValue

      this._searchService.search(searchParams).subscribe((value) => {
        if (value['num-found'] > 0) {
          this.openDialog(value)
        }
      })
    }
  }

  openDialog(duplicateRecordsSearchResults: SearchResults): void {
    const duplicateRecords = duplicateRecordsSearchResults['expanded-result']
    const dialogParams = {
      width: `1078px`,
      height: `600px`,
      maxWidth: `90vw`,

      data: {
        duplicateRecords,
        titleLabel: $localize`:@@register.titleLabel:Could this be you?`,
        // tslint:disable-next-line: max-line-length
        bodyLabel: $localize`:@@register.bodyLabel:We found some accounts with your name, which means you may have already created an ORCID iD using a different email address. Before creating an account, please confirm that none of these records belong to you. Not sure if any of these are you?`,
        contactLabel: $localize`:@@register.contactLabel:Contact us.`,
        firstNameLabel: $localize`:@@register.firstNameLabel:First Name`,
        lastNameLabel: $localize`:@@register.lastNameLabel:Last Name`,
        affiliationsLabel: $localize`:@@register.affiliationsLabel:Affiliations`,
        dateCreatedLabel: $localize`:@@register.dateCreatedLabel:Date Created`,
        viewRecordLabel: $localize`:@@register.viewRecordLabel:View Record`,
        signinLabel: $localize`:@@register.signinLabel:I ALREADY HAVE AN ID, GO BACK TO SIGN IN`,
        continueLabel: $localize`:@@register.continueLabel:NONE OF THESE ARE ME, CONTINUE WITH REGISTRATION`,
      },
    }

    if (this.platform.tabletOrHandset) {
      dialogParams['maxWidth'] = '95vw'
      dialogParams['maxHeight'] = '95vh'
    }

    const dialogRef = this._dialog.open(IsThisYouComponent, dialogParams)

    dialogRef.afterClosed().subscribe((confirmRegistration) => {
      if (!confirmRegistration) {
        this._router.navigate(['signin'])
      }
    })
  }

  selectionChange(event: StepperSelectionEvent) {
    if (event.previouslySelectedIndex === 0) {
      this.afterStepASubmitted()
    }
    if (this.platform.columns4 || this.platform.columns8) {
      this.focusCurrentStep(event)
    }
  }

  // Fix to material vertical stepper not focusing current header
  // related issue https://github.com/angular/components/issues/8881
  focusCurrentStep(event: StepperSelectionEvent) {
    let nextStep: ElementRef
    if (event.selectedIndex === 0) {
      nextStep = this.stepComponentA
    } else if (event.selectedIndex === 1) {
      nextStep = this.stepComponentB
    } else if (event.selectedIndex === 2) {
      nextStep = this.stepComponentC
    }
    // On mobile scroll the current step component into view
    if (this.platform.columns4 || this.platform.columns8) {
      setTimeout(() => {
        const nativeElementNextStep = nextStep.nativeElement as HTMLElement
        nativeElementNextStep.scrollIntoView()
      }, 200)
    }
  }

  /**
   * Fills the register form.
   * Use the data from the Oauth session send by the Orcid integrator
   * or
   * Use data coming from a third party institution/social entity
   * or
   * Use empty values
   */
  private prefillRegisterForm(
    oauthData: RequestInfoForm,
    thirdPartyOauthData: ThirdPartyAuthData
  ) {
    return this._formBuilder.group({
      personal: [
        {
          givenNames:
            oauthData?.userGivenNames ||
            thirdPartyOauthData?.signinData?.firstName ||
            '',
          familyNames:
            oauthData?.userFamilyNames ||
            thirdPartyOauthData?.signinData?.lastName ||
            '',
          emails: {
            email:
              oauthData?.userEmail ||
              thirdPartyOauthData?.signinData?.email ||
              '',
            confirmEmail: '',
            additionalEmails: { '0': '' },
          },
        },
      ],
    })
  }
}
