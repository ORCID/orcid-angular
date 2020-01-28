import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core'
import { PlatformInfoService } from 'src/app/core'

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.scss'],
})
export class AdvanceSearchComponent implements OnInit {
  isAPhoneScreen = false
  showAdvanceSearch = false

  constructor(
    _platform: PlatformInfoService,
    @Inject(LOCALE_ID) private locale: string
  ) {
    _platform.get().subscribe(data => {
      this.isAPhoneScreen = data.columns4
    })
  }

  toggleAdvanceSearch() {
    this.showAdvanceSearch = !this.showAdvanceSearch
    this.tempFixForOutlineFormInputCalculation()
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

  ngOnInit() {}
}
