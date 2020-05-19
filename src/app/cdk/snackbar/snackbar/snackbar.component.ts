import { Component, OnInit, Inject, HostBinding } from '@angular/core'
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar'
import { ScreenDirection } from 'src/app/types'
import { PlatformInfoService } from '../../platform-info'
import { take } from 'rxjs/operators'

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: [
    './snackbar.component.scss.theme.scss',
    './snackbar.component.scss',
  ],
})
export class SnackbarComponent implements OnInit {
  @HostBinding('attr.dir') _contentDirection: ScreenDirection = 'ltr'
  isIE = false
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private _platform: PlatformInfoService
  ) {
    this._contentDirection = data.contentDirection
    this._platform
      .get()
      .pipe(take(1))
      .subscribe((value) => {
        this.isIE = value.ie
      })
  }

  ngOnInit() {}
}
