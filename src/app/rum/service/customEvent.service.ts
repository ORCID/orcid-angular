import { Inject, Injectable } from '@angular/core'
import { WINDOW } from 'src/app/cdk/window'
import { JourneyType, JourneyContextMap, EventAttrMap } from '../journeys/types'

type JourneyState = {
  startTime: number
  journeyId: string
  context: Record<string, unknown>
}

function withPrefix<T extends object>(
  obj: T,
  prefix: string
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const key of Object.keys(obj || {})) {
    result[`${prefix}${key}`] = (obj as any)[key]
  }
  return result
}

function generateId(): string {
  // Simple unique id generator
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

@Injectable({ providedIn: 'root' })
export class RumJourneyEventService {
  private journeys: Partial<Record<JourneyType, JourneyState>> = {}

  constructor(@Inject(WINDOW) private window: Window) {}

  startJourney<T extends JourneyType>(
    journeyType: T,
    context: JourneyContextMap[T]
  ): void {
    if (this.journeys[journeyType]) {
      if (runtimeEnvironment.debugger) {
        console.debug(
          `[RUM][journey:${journeyType}] : start (ignored, already started)`,
          context
        )
      }
      return
    }
    const journeyId = generateId()
    this.journeys[journeyType] = {
      startTime: Date.now(),
      journeyId,
      context: { ...context },
    }
    if (runtimeEnvironment.debugger) {
      console.debug(`[RUM][journey:${journeyType}] : start`, context)
    }
  }

  updateJourneyContext<T extends JourneyType>(
    journeyType: T,
    extraContext: Partial<JourneyContextMap[T]>
  ): void {
    const state = this.journeys[journeyType]
    if (!state) return
    state.context = { ...state.context, ...extraContext }
  }

  recordEvent<T extends JourneyType>(
    journeyType: T,
    eventName: string,
    eventAttrs?: EventAttrMap[T]
  ): void {
    const state = this.journeys[journeyType]
    if (!state) {
      if (runtimeEnvironment.debugger) {
        console.debug(
          `[RUM][journey:${journeyType}] : recordEvent before start ignored`,
          eventName,
          eventAttrs
        )
      }
      return
    }
    const elapsedMs = Date.now() - state.startTime
    const payload = {
      ...withPrefix(state.context, 'journeyContext_'),
      ...withPrefix(eventAttrs || ({} as any), 'eventAttribute_'),
      system_eventName: eventName,
      system_elapsedMs: elapsedMs,
      system_journeyId: state.journeyId,
      system_journeyType: journeyType,
    }
    const nr = (this.window as any).newrelic
    if (typeof nr?.addPageAction === 'function') {
      nr.addPageAction(journeyType, payload)
    }
    if (runtimeEnvironment.debugger) {
      console.debug(
        `[RUM][journey:${journeyType}] : event ${eventName}`,
        payload
      )
    }
  }

  finishJourney<T extends JourneyType>(
    journeyType: T,
    finalAttrs?: Partial<EventAttrMap[T]>
  ): void {
    const state = this.journeys[journeyType]
    if (!state) return
    const elapsedMs = Date.now() - state.startTime
    const payload = {
      ...withPrefix(state.context, 'journeyContext_'),
      ...withPrefix(finalAttrs || ({} as any), 'eventAttribute_'),
      system_eventName: 'journey_finished',
      system_elapsedMs: elapsedMs,
      system_journeyId: state.journeyId,
      system_journeyType: journeyType,
    }
    const nr = (this.window as any).newrelic
    if (typeof nr?.addPageAction === 'function') {
      nr.addPageAction(journeyType, payload)
    }
    delete this.journeys[journeyType]
    if (runtimeEnvironment.debugger) {
      console.debug(`[RUM][journey:${journeyType}] : finished`, payload)
    }
  }
}
