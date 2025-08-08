import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  LOCALE_ID,
  OnChanges,
  OnInit,
  Optional,
  SimpleChanges,
  ViewChild,
} from '@angular/core'
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { Router } from '@angular/router'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { ORCID_REGEXP_CASE_INSENSITIVE } from 'src/app/constants'
import { SearchService } from 'src/app/core/search/search.service'
import { ScreenDirection, SearchResults } from 'src/app/types'

import { AtLeastOneInputHasValue } from './at-least-one-input-has-value.validator'

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: [
    './advance-search.component.scss-theme.scss',
    './advance-search.component.scss',
  ],
  standalone: false,
})
export class AdvanceSearchComponent implements OnInit, OnChanges {
  @Input() searchValues: SearchResults
  @ViewChild('searchForm') searchForm: ElementRef<HTMLElement>
  isAPhoneScreen = false
  showAdvanceSearch = false
  ngOrcidSearchInstitutionNamePlaceholder = $localize`:@@ngOrcid.search.institutionNamePlaceholder:affiliation or organization ID`
  ngOrcidSearchAdvanceSearch = $localize`:@@ngOrcid.search.advanceSearch:ADVANCED SEARCH`
  ngOrcidShowAdvanceSearch = $localize`:@@search.showAdvanceSearch:Show advanced search form`
  ngOrcidHideAdvanceSearch = $localize`:@@search.hideAdvanceSearch:Hide advanced search form`

  advanceSearch: UntypedFormGroup
  constructor(
    _platform: PlatformInfoService,
    @Optional() private _search: SearchService,
    @Inject(LOCALE_ID) private locale: string,
    @Optional() private router: Router,
    private _changeDec: ChangeDetectorRef
  ) {
    _platform.get().subscribe((data) => {
      this.isAPhoneScreen = data.columns4
    })
    this.advanceSearch = new UntypedFormGroup(
      {
        firstName: new UntypedFormControl('', []),
        lastName: new UntypedFormControl('', []),
        institution: new UntypedFormControl('', []),
        keyword: new UntypedFormControl('', []),
        otherFields: new UntypedFormControl('', []),
        orcid: new UntypedFormControl('', [
          Validators.pattern(ORCID_REGEXP_CASE_INSENSITIVE),
        ]),
      },
      { validators: AtLeastOneInputHasValue() }
    )
  }
  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    // it opens the advanced search with the search parameters
    if (
      this.searchValues &&
      Object.keys(this.searchValues).length &&
      this.searchValues['searchQuery'] == null
    ) {
      this.showAdvanceSearch = true
      this.advanceSearch.patchValue(this.searchValues)
    }

    // If has no parameters
    // it opens the advanced search empty
    if (this.searchValues && !Object.keys(this.searchValues).length) {
      this.showAdvanceSearch = true
    }

    // If is a quick search
    // clean and close the advanced search
    if (this.searchValues && this.searchValues['searchQuery']) {
      this.showAdvanceSearch = false
      this.advanceSearch.reset()
    }
  }

  toggleAdvanceSearch() {
    this.showAdvanceSearch = !this.showAdvanceSearch
    this.tempFixForOutlineFormInputCalculation()
    if (this.showAdvanceSearch) {
      this._changeDec.detectChanges()
      this.searchForm.nativeElement.focus()
    }
  }

  search() {
    if (this.advanceSearch.valid) {
      this.router.navigate(['/orcid-search/search'], {
        queryParams: this._search.searchParametersAdapter(
          this.advanceSearch.value
        ),
      })
    }
  }

  // tslint:disable-next-line: member-ordering
  tempFixForOutlineFormInputCalculationIssue_Direction: ScreenDirection = 'ltr'
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
