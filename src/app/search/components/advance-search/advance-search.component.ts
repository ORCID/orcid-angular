import {
  Component,
  OnInit,
  LOCALE_ID,
  Inject,
  Input,
  Optional,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core'
import { LOCALE } from '../../../../locale/messages.dynamic.en'
import { FormControl, Validators, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { ORCID_REGEXP } from 'src/app/constants'
import { AtLeastOneInputHasValue } from './at-least-one-input-has-value.validator'
import { WINDOW } from 'src/app/cdk/window'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { SearchResults } from 'src/app/types'
import { SearchService } from 'src/app/core/search/search.service'

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: [
    './advance-search.component.scss-theme.scss',
    './advance-search.component.scss',
  ],
})
export class AdvanceSearchComponent implements OnInit, OnChanges {
  @Input() searchValues: SearchResults
  @ViewChild('searchForm', { static: false }) searchForm: ElementRef<
    HTMLElement
  >
  isAPhoneScreen = false
  showAdvanceSearch = false
  ngOrcidSearchInstitutionNamePlaceholder =
    LOCALE['ngOrcid.search.institutionNamePlaceholder']
  advanceSearch: FormGroup
  constructor(
    _platform: PlatformInfoService,
    private _search: SearchService,
    @Inject(LOCALE_ID) private locale: string,
    @Optional() private router: Router,
    @Inject(WINDOW) private window: Window,
    private _changeDec: ChangeDetectorRef
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
  }
  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    // it opens the advance search with the search parameters
    if (
      this.searchValues &&
      Object.keys(this.searchValues).length &&
      this.searchValues['searchQuery'] == null
    ) {
      this.showAdvanceSearch = true
      this.advanceSearch.patchValue(this.searchValues)
    }

    // If has no parameters
    // it opens the advance search empty
    if (this.searchValues && !Object.keys(this.searchValues).length) {
      this.showAdvanceSearch = true
    }

    // If is a quick search
    // clean and close the advance search
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
    console.log(this.advanceSearch.value)
    if (this.advanceSearch.valid) {
      this.router.navigate(['/orcid-search/search'], {
        queryParams: this._search.trimSearchParameters(
          this.advanceSearch.value
        ),
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
