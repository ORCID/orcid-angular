import { Component, OnDestroy, OnInit } from '@angular/core'
import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { Router } from '@angular/router'
import { Title } from '@angular/platform-browser'

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  platform: PlatformInfo

  titleNotFound = $localize`:@@shared.titleNotFound:404 - ORCID record not found`

  constructor(
    private router: Router,
    private _titleService: Title,
    private _platform: PlatformInfoService
  ) {
    _titleService.setTitle(this.titleNotFound)
    _platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((data) => {
        this.platform = data
      })
  }

  ngOnInit(): void {}

  goto(url) {
    this.router.navigate([url])
  }

  ngOnDestroy(): void {
    this._titleService.setTitle('ORCID')
  }
}
