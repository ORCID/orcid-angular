import {
  Component,
  OnInit,
  LOCALE_ID,
  Inject,
  Input,
  Optional,
} from '@angular/core'
import { PlatformInfoService, WINDOW } from 'src/app/core'
import { LOCALE } from '../../../../locale/messages.dynamic.en'
import { FormControl, Validators, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { ORCID_REGEXP } from 'src/app/constants'
import { AtLeastOneInputHasValue } from './at-least-one-input-has-value.validator'
import { TogglzService } from 'src/app/core/togglz/togglz.service'

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: [
    './advance-search.component.scss-theme.scss',
    './advance-search.component.scss',
  ],
})
export class AdvanceSearchComponent implements OnInit {
  @Input() searchValues
  isAPhoneScreen = false
  showAdvanceSearch = false
  ngOrcidSearchInstitutionNamePlaceholder =
    LOCALE['ngOrcid.search.institutionNamePlaceholder']
  advanceSearch
  togglzAdvanceSearch = false
  constructor(
    _platform: PlatformInfoService,
    @Inject(LOCALE_ID) private locale: string,
    @Optional() private router: Router,
    _togglz: TogglzService,
    @Inject(WINDOW) private window: Window
  ) {
    _platform.get().subscribe(data => {
      this.isAPhoneScreen = data.columns4
    })
    this.advanceSearch = new FormGroup(
      {
        firstName: new FormControl('', []),
        lastName: new FormControl('', []),
        institution: new FormControl('', []),
        keyword: new FormControl('', []),
        otherFields: new FormControl('', []),
        orcid: new FormControl('', [Validators.pattern(ORCID_REGEXP)]),
      },
      { validators: AtLeastOneInputHasValue() }
    )
    _togglz.getStateOf('ORCID_ANGULAR_ADVANCE_SEARCH').subscribe(value => {
      this.togglzAdvanceSearch = value
    })
  }

  ngOnInit() {
    // If the search query is empty or it has advance search parameter values
    // it opens the advance search by default

    if (
      this.searchValues &&
      (!Object.keys(this.searchValues).length ||
        this.searchValues['searchQuery'] == null)
    ) {
      this.showAdvanceSearch = true
      this.advanceSearch.setValue(this.searchValues)
    }
  }

  toggleAdvanceSearch() {
    if (this.togglzAdvanceSearch) {
      this.showAdvanceSearch = !this.showAdvanceSearch
      this.tempFixForOutlineFormInputCalculation()
    } else {
      this.window.location.href = '/orcid-search/search'
    }
  }

  search() {
    if (this.advanceSearch.valid) {
      this.router.navigate(['/orcid-search/search'], {
        queryParams: this.advanceSearch.value,
      })
    }
  }

  // tslint:disable-next-line: member-ordering
  tempFixForOutlineFormInputCalculationIssue_Direction = 'ltr'
  tempFixForOutlineFormInputCalculation() {
    // This is a temporal way to fix an MatFormField issue
    // that does not allow the correct calculation for the border gap on the outline form inputs on RTL languages.
    //
    // This function, SCSS overwrites on `src\assets\scss\material.orcid.overwrites.scss\form-field-outline.scss`,
    // and the template of this component should be clean once angular releases the fix.
    //
    // More info about this issue on
    // https://github.com/angular/components/issues/17390

    if (this.locale === 'ar') {
      if (this.showAdvanceSearch) {
        setTimeout(() => {
          // Applies RTL direction just after MatFormField was loaded
          this.tempFixForOutlineFormInputCalculationIssue_Direction = 'rtl'
        }, 0)
      } else {
        // The components should be loaded with LTR styles for MatFormField to calculate the empty gap correctly
        this.tempFixForOutlineFormInputCalculationIssue_Direction = 'ltr'
      }
    }
  }
}
