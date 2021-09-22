import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from '../../../../../cdk/platform-info'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-top-bar-verification-email-modal',
  templateUrl: './top-bar-verification-email-modal.component.html',
  styleUrls: ['./top-bar-verification-email-modal.component.scss']
})
export class TopBarVerificationEmailModalComponent implements OnInit {
  $destroy: Subject<boolean> = new Subject<boolean>()

  primaryEmail: string
  isMobile: boolean

  constructor(
    private _platform: PlatformInfoService,
  ) {
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
      })
  }

  ngOnInit(): void {
  }

}
