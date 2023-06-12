import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { DeveloperToolsService } from 'src/app/core/developer-tools/developer-tools.service'

@Component({
  selector: 'app-terms-of-use',
  templateUrl: './terms-of-use.component.html',
  styleUrls: [
    './terms-of-use.component.scss',
    './terms-of-use.component.scss-theme.scss',
  ],
})
export class TermsOfUseComponent implements OnInit {
  checked
  dirty: boolean
  @Output() developerToolsEnable = new EventEmitter<boolean>()

  constructor(private developerToolsService: DeveloperToolsService) {}

  ngOnInit(): void {}

  registerForPublicApi() {
    this.dirty = true
    if (!this.checked) {
      return
    }
    this.developerToolsService.enableDeveloperTools().subscribe((res) => {
      this.developerToolsEnable.next(true)
    })
  }
}
