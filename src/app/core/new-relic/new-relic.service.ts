import { Inject, Injectable } from '@angular/core'
import { take } from 'rxjs/operators'
import { WINDOW } from 'src/app/cdk/window'
import { TogglzFlag } from 'src/app/types/config.endpoint'
import { TogglzService } from 'src/app/core/togglz/togglz.service'

@Injectable({
  providedIn: 'root',
})
export class NewRelicService {
  rumTogglz: boolean = false

  constructor(
    @Inject(WINDOW) private window: Window,
    private togglzService: TogglzService
  ) {}

  public init() {
    this.togglzService
      .getStateOf(TogglzFlag.RUM)
      .pipe(take(1))
      .subscribe((rum) => {
        this.rumTogglz = rum
        if (
          (this.window as any)?.newrelic?.start &&
          typeof (this.window as any).newrelic.start === 'function' &&
          this.rumTogglz
        ) {
          ;(this.window as any).newrelic.start()
        }
      })
  }
}
