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
    ;(this.window as any).orcidForceRumHarvest = () => this.forceHarvestNow()

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

  public forceHarvestNow() {
    const initializedAgents =
      (this.window as any)?.NREUM?.initializedAgents ??
      ({} as Record<string, unknown>)
    const agent = Object.values(initializedAgents)[0] as any
    const harvester = agent?.runtime?.harvester
    const initializedAggregates = harvester?.initializedAggregates ?? []

    initializedAggregates.forEach((aggregate: any) => {
      if (typeof aggregate?.makeHarvestPayload !== 'function') {
        return
      }
      try {
        harvester?.triggerHarvestFor?.(aggregate)
      } catch {
        // Never block navigation or user flow for telemetry.
      }
    })
  }
}
