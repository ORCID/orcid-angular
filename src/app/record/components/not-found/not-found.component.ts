import { Component, OnInit } from '@angular/core'
import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { Router } from '@angular/router'

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
  $destroy: Subject<boolean> = new Subject<boolean>()

  platform: PlatformInfo

  constructor(private router: Router, private _platform: PlatformInfoService) {
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
}
