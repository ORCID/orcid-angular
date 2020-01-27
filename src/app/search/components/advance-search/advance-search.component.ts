import { Component, OnInit } from '@angular/core'
import { PlatformInfoService } from 'src/app/core'

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.scss'],
})
export class AdvanceSearchComponent implements OnInit {
  isAPhoneScreen = false
  showAdvanceSearch = false
  constructor(_platform: PlatformInfoService) {
    _platform.get().subscribe(data => {
      this.isAPhoneScreen = data.columns4
    })
  }

  toggleAdvanceSearch() {
    this.showAdvanceSearch = !this.showAdvanceSearch
  }

  ngOnInit() {}
}
