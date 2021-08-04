import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Input,
} from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { FormBuilder,FormControl, FormGroup, Validators, FormArray } from '@angular/forms'
import { OrcidValidators } from '../../../../../validators'
import { dateValidator } from '../../../../../shared/validators/date/date.validator'

import {
  ILLEGAL_NAME_CHARACTERS_REGEXP,
  URL_REGEXP,
} from '../../../../../constants'
import { UserRecord } from '../../../../../types/record.local'
import { RecordCountriesService } from '../../../../../core/record-countries/record-countries.service'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { Subject } from 'rxjs'
import {
  PlatformInfo,
  PlatformInfoService,
} from '../../../../../cdk/platform-info'
import { VisibilityStrings } from '../../../../../types/common.endpoint'
import { RecordCountryCodesEndpoint } from '../../../../../types'
import { first, takeUntil } from 'rxjs/operators'
import { cloneDeep } from 'lodash'
import { UserSession } from '../../../../../types/session.local'
import { RecordFundingsService } from 'src/app/core/record-fundings/record-fundings.service'
import { UserService } from '../../../../../core'
import { WINDOW } from '../../../../../cdk/window'
import {
  FundingRelationships, 
  LanguageMap, 
  CurrencyCodeMap,
  FundingTypes,
  Funding,
  FundingTypesLabel,
  FundingExternalIndentifierType,
  } from 'src/app/types/record-funding.endpoint'
import { Title } from '@angular/platform-browser'


@Component({
  selector: 'app-modal-funding',
  templateUrl: './modal-funding.component.html',
  styleUrls: [
    './modal-funding.component.scss-theme.scss',
    './modal-funding.component.scss',
  ],
})
export class ModalFundingComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  @Input() type: string
  @Input() funding: Funding

  platform: PlatformInfo
  fundingForm: FormGroup
  showTranslationTitle = false
  languageMap = LanguageMap
  currencyCodeMap = CurrencyCodeMap
  userRecord: UserRecord
  userSession: UserSession
  isMobile: boolean
  defaultVisibility: VisibilityStrings
  addedOtherNameCount = 0
  loadingFunding = true
  startDateValid: boolean
  endDateValid: boolean
  countryCodes: { key: string; value: string }[]
  originalCountryCodes: RecordCountryCodesEndpoint
  loadingCountryCodes = true
  fundingTypes = FundingTypes
  fundingTitle = Title
  fundingTypesLabel = FundingTypesLabel 
  fundingRelationships: FundingRelationships[] = Object.keys(
    FundingRelationships
  ) as FundingRelationships[]

  years = Array(110)
    .fill(0)
    .map((i, idx) => idx + new Date().getFullYear() - 109)
    .reverse()
  yearsEndDate = Array(120)
    .fill(0)
    .map((i, idx) => idx + new Date().getFullYear() - 109)
    .reverse()
  months = Array(12)
    .fill(0)
    .map((i, idx) => idx + 1)
  

  ngOrcidYear = $localize`:@@shared.year:Year`
  ngOrcidMonth = $localize`:@@shared.month:Month`


  constructor(
    @Inject(WINDOW) private window: Window,
    private _platform: PlatformInfoService,
    public dialogRef: MatDialogRef<ModalComponent>,

    @Inject(MAT_DIALOG_DATA) public data: UserRecord,
    private _userService: UserService,
    private _recordCountryService: RecordCountriesService,
    private _fundingsService: RecordFundingsService,

    //private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: FormBuilder
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

  fundingType= ''
  fundingSubtype= ''
  fundingProjectTitle= ''
  fundingProjectLink= ''
  description= ''
  visibility= ''
  agencyName =''
  city = ''
  region = ''
  country = ''
  countryForDisplay = ''
  title = ''
  link = ''
  amount =''
  currencyCode=''
  grantsArray: FormArray
  disambiguatedFundingSourceId=''
  disambiguatedFundingSource=''
  

  ngOnInit(): void {
    this.initialValues()
      this.loadingFunding = false
      this.fundingForm = this._formBuilder.group({
        fundingType: new FormControl(this.fundingType, {
          validators: [Validators.required],
        }),
        fundingSubtype: new FormControl(this.fundingSubtype, {}),
        fundingProjectTitle: new FormControl(this.fundingProjectTitle, {
          validators: [Validators.required],
        }),
        translatedTitleContent: ['', []],
        translatedTitleLanguage: ['', []],
        fundingProjectLink: new FormControl(this.fundingProjectLink, {
          validators: [Validators.pattern(URL_REGEXP)],
        }),
        description: new FormControl(this.description, {}),
        amount: new FormControl(this.amount, {}),
        currencyCode: new FormControl(this.currencyCode, {}),
        startDateGroup: this._formBuilder.group(
          {
            startDateMonth: [''],
            startDateYear: [''],
          },
          //{ validator: dateValidator('startDate') }
        ),
        endDateGroup: this._formBuilder.group(
          {

            endDateMonth: [''],
            endDateYear: [''],
          },
          //{ validator: dateValidator('endDate') }
        ),
        agencyName: new FormControl(this.agencyName, {
          validators: [Validators.required],
        }),
        city: new FormControl(this.city, {
          validators: [Validators.required],
        }),
        region: new FormControl(this.region, {}),
        country: new FormControl(this.country, {
          validators: [Validators.required],
        }),
        grants: new FormArray([
          this._formBuilder.group({
            grantNumber: ['', []],
            grantUrl: ['', [Validators.pattern(URL_REGEXP)]],
            fundingRelationship: [FundingRelationships.self, []],
          }),
        ]),
        visibility: new FormControl(this.visibility, {
          validators: [Validators.required],
        }),   
      })


      this.grantsArray = this.fundingForm.controls
          .grants as FormArray

      this._recordCountryService
      .getCountryCodes()
      .pipe(first())
      .subscribe((codes) => {
        this.originalCountryCodes = codes
        this.countryCodes = Object.entries(codes).map((keyValue) => {
          return { key: keyValue[0], value: keyValue[1] }
        })
        this.countryCodes.sort((a, b) => {
          if (a.key < b.key) {
            return -1
          }
          if (a.key > b.key) {
            return 1
          }
          return 0
        })
        this.loadingCountryCodes = false
        if (this.funding) {
          this.fundingForm.patchValue({
            country: this.countryCodes.find(
              (x) => x.value === this.funding.country.value
            ).key,
          })
        }
      })

  }

  initialValues() {
    console.log("funding obj sent by Edit", this.funding)
    if (this.funding) {
      this.city = this.funding.city.value
      this.region = this.funding.region.value
      this.country = this.funding.country.value
    }
  }


  onSubmit() {}

  addAnotherGrant() {
    this.grantsArray.controls.push(
      this._formBuilder.group({
        grantNumber: ['', []],
        grantUrl: ['', [Validators.pattern(URL_REGEXP)]],
        fundingRelationship: [FundingRelationships.self, []],
      })
    )
    /*this.checkGrantsArrayChanges(
      this.grantsArray.controls.length - 1
    )*/
    console.log(this.grantsArray)
  }

  deleteGrant(id: number) {
    this.grantsArray.removeAt(id)
  }

  saveEvent() {
    this.fundingForm.markAllAsTouched()
    console.log('_____ Save event !!! ')

    if (this.fundingForm.valid) {
      const fundingObj: Funding = {
        visibility: {
          visibility: this.fundingForm.get('visibility').value
            ? this.fundingForm.get('visibility').value
            : this.defaultVisibility,
        },
        putCode: {
          value: this.funding?.putCode?.value,
        },
        fundingTitle: {
          title: this.fundingForm.value.fundingProjectTitle,
          errors :[],
          translatedTitle: {
            content: this.fundingForm.value.translatedTitleContent,
            languageCode: this.fundingForm.value.translatedTitleLanguage,
            errors: []
          },
        },
        description: {
          value: this.fundingForm.value.description,
        },
        organizationDefinedFundingSubType: {
          subtype : this.fundingForm.value.fundingSubtype,
          alreadyIndexed: false, // what value should be here ?
        }, 
        fundingName: {
          value: this.fundingForm.value.agencyName,
        },
        fundingType: {
          value: this.fundingForm.value.fundingType,
        },
        currencyCode: {
          value: this.fundingForm.value.currencyCode,
        },
        amount: {
          value: this.fundingForm.value.amount,
        },
        url: {
          value: this.fundingForm.value.url,
        },
        startDate: {
          month: this.addTrailingZero(
            this.fundingForm.get('startDateGroup.startDateMonth').value
          ),
          year: this.fundingForm.get('startDateGroup.startDateYear').value,
        },
        endDate: {
          month: this.addTrailingZero(
            this.fundingForm.get('endDateGroup.endDateMonth').value
          ),
          year: this.fundingForm.get('endDateGroup.endDateYear').value,
        },
        externalIdentifiers: this.fundingForm.value.grants.map(
          (grant) => {
            return {
              externalIdentifierId: grant.grantNumber,
              externalIdentifierType: FundingExternalIndentifierType.grant_number, // is it allways grant_number?
              url: grant.grantUrl,
              relationship: grant.fundingRelationship,
            }
          }
        ),
        //contributors?: Contributor[]  what should go here ?
        disambiguatedFundingSourceId: {
          value: this.disambiguatedFundingSourceId
        },
        disambiguationSource: {
          value: this.disambiguatedFundingSource,
        },
        city: {
          value: this.fundingForm.value.city,
        },
        region: {
          value: this.fundingForm.value.region,
        },
        country: {
          value: this.countryCodes.find(
            (x) => x.key === this.fundingForm.get('country').value
          ).value,
        }, 
      }

      this._fundingsService
        .save(fundingObj)
        .pipe(first())
        .subscribe(() => {
        this.closeEvent()
      })
    } else {
      console.log(this.fundingForm.errors)
    }

  }

  closeEvent() {
    this.dialogRef.close()
  }

  toFundingDetails() {
    this.window.document.getElementById('funding-details').scrollIntoView()
  }

  toFundingAgency() {
    this.window.document.getElementById('funding-agency').scrollIntoView()
  }

  toVisibility() {
    this.window.document.getElementById('visibility').scrollIntoView()
  }

  toGrantDetails() {
    this.window.document.getElementById('grant-details').scrollIntoView()
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }

  private addTrailingZero(date: string): string {
    if (date && Number(date) < 10) {
      return '0' + date
    }
    return date
  }
}
