import { Component, OnInit, Inject, HostBinding } from '@angular/core'
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar'
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
  @HostBinding('class.mat-body-2') _matBody2 = true
  isIE = false

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private _platform: PlatformInfoService
  ) {
    this._platform
      .get()
      .pipe(take(1))
      .subscribe((value) => {
        this.isIE = value.ie
      })
  }

  ngOnInit() {}
}
