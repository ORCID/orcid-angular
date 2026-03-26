import { Inject, Injectable } from '@angular/core'
import { WINDOW } from 'src/app/cdk/window'
import { NewRelicService } from 'src/app/core/new-relic/new-relic.service'
import { JourneyType, JourneyContextMap, EventAttrMap } from '../journeys/types'
import {
  isTerminatingJourneyEvent,
  isTerminatingSimpleEvent,
} from '../terminating-rum-events'

type JourneyState = {
  startTime: number
  journeyId: string
  context: Record<string, unknown>
}

const BLOCKED_RUM_KEY_PATTERN = /(orcid|email|pid|delegator)/i
const ORCID_VALUE_PATTERN = /\b\d{4}-\d{4}-\d{4}-\d{3}[\dX]\b/i
const EMAIL_VALUE_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i
const PID_HINT_PREFIX = '[PID_HINT:'

function sensitiveHint(kind: string, details: string): string {
  return `${PID_HINT_PREFIX}${kind};${details}]`
}

function summarizeStringValue(value: string): string {
  const len = value.length
  return `len=${len}`
}

function sanitizeSensitiveValue(value: unknown, key?: string): string {
  if (typeof value === 'string') {
    if (ORCID_VALUE_PATTERN.test(value)) {
      return sensitiveHint('orcid', summarizeStringValue(value))
    }
    if (EMAIL_VALUE_PATTERN.test(value)) {
      return sensitiveHint('email', summarizeStringValue(value))
    }
    return sensitiveHint(
      'sensitive_key',
      `key=${(key || 'unknown').toLowerCase()};${summarizeStringValue(value)}`
    )
  }

  const valueType = Array.isArray(value) ? 'array' : typeof value
  return sensitiveHint(
    'sensitive_key',
    `key=${(key || 'unknown').toLowerCase()};type=${valueType}`
  )
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

function sanitizeRumValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeRumValue(item))
  }

  if (value && typeof value === 'object') {
    const input = value as Record<string, unknown>
    const output: Record<string, unknown> = {}
    for (const [key, rawValue] of Object.entries(input)) {
      if (BLOCKED_RUM_KEY_PATTERN.test(key)) {
        output[key] = sanitizeSensitiveValue(rawValue, key)
        continue
      }
      const cleaned = sanitizeRumValue(rawValue)
      output[key] = cleaned
    }
    return output
  }

  if (typeof value === 'string') {
    if (ORCID_VALUE_PATTERN.test(value) || EMAIL_VALUE_PATTERN.test(value)) {
      return sanitizeSensitiveValue(value)
    }
    return value
  }

  return value
}

function generateId(): string {
  // Simple unique id generator
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

/** Pretty-print payloads for debugger console output. */
function rumDebugJson(data: unknown): string {
  try {
    return JSON.stringify(data, null, 2)
  } catch {
    return String(data)
  }
}

@Injectable({ providedIn: 'root' })
export class RumJourneyEventService {
  private journeys: Partial<Record<JourneyType, JourneyState>> = {}

  constructor(
    @Inject(WINDOW) private window: Window,
    private newRelic: NewRelicService
  ) {}

  /** @returns true if `addPageAction` ran successfully */
  private safeAddPageAction(
    eventType: string,
    payload: Record<string, unknown>
  ): boolean {
    const nr = (this.window as any).newrelic
    if (typeof nr?.addPageAction !== 'function') {
      return false
    }
    try {
      nr.addPageAction(eventType, payload)
      return true
    } catch (error) {
      if (runtimeEnvironment.debugger) {
        console.warn(
          `[RUM] addPageAction failed for ${eventType}\n${rumDebugJson({
            error,
            payload,
          })}`
        )
      }
      return false
    }
  }

  startJourney<T extends JourneyType>(
    journeyType: T,
    context: JourneyContextMap[T]
  ): void {
    const sanitizedContext = sanitizeRumValue(context) as
      | JourneyContextMap[T]
      | undefined
    if (this.journeys[journeyType]) {
      if (runtimeEnvironment.debugger) {
        console.debug(
          `[RUM][journey:${journeyType}] : start (ignored, already started)\n${rumDebugJson(
            sanitizedContext || {}
          )}`
        )
      }
      return
    }
    const journeyId = generateId()
    this.journeys[journeyType] = {
      startTime: Date.now(),
      journeyId,
      context: { ...(sanitizedContext || {}) },
    }
    if (runtimeEnvironment.debugger) {
      console.debug(
        `[RUM][journey:${journeyType}] : start\n${rumDebugJson(
          sanitizedContext || {}
        )}`
      )
    }
  }

  // Records a standalone event without requiring a journey lifecycle
  recordSimpleEvent(eventName: string, attrs?: Record<string, unknown>): void {
    const sanitizedAttrs = sanitizeRumValue(attrs || {}) as Record<
      string,
      unknown
    >
    const sent = this.safeAddPageAction(eventName, sanitizedAttrs)
    if (sent && isTerminatingSimpleEvent(eventName)) {
      this.newRelic.forceHarvestNow()
    }
    if (runtimeEnvironment.debugger) {
      console.debug(
        `[RUM][simple] : event ${eventName}\n${rumDebugJson(sanitizedAttrs)}`
      )
    }
  }

  updateJourneyContext<T extends JourneyType>(
    journeyType: T,
    extraContext: Partial<JourneyContextMap[T]>
  ): void {
    const state = this.journeys[journeyType]
    if (!state) return
    state.context = {
      ...state.context,
      ...(sanitizeRumValue(extraContext) as Record<string, unknown>),
    }
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
          `[RUM][journey:${journeyType}] : recordEvent before start ignored\n${rumDebugJson(
            { eventName, eventAttrs }
          )}`
        )
      }
      return
    }
    const elapsedMs = Date.now() - state.startTime
    const sanitizedEventAttrs = sanitizeRumValue(eventAttrs || {}) as Record<
      string,
      unknown
    >
    const payload = {
      ...withPrefix(state.context, 'journeyContext_'),
      ...withPrefix(sanitizedEventAttrs, 'eventAttribute_'),
      system_eventName: eventName,
      system_elapsedMs: elapsedMs,
      system_journeyId: state.journeyId,
      system_journeyType: journeyType,
    }
    const sent = this.safeAddPageAction(journeyType, payload)
    if (sent && isTerminatingJourneyEvent(journeyType, eventName)) {
      this.newRelic.forceHarvestNow()
    }
    if (runtimeEnvironment.debugger) {
      console.debug(
        `[RUM][journey:${journeyType}] : event ${eventName}\n${rumDebugJson(
          payload
        )}`
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
    const sanitizedFinalAttrs = sanitizeRumValue(finalAttrs || {}) as Record<
      string,
      unknown
    >
    const payload = {
      ...withPrefix(state.context, 'journeyContext_'),
      ...withPrefix(sanitizedFinalAttrs, 'eventAttribute_'),
      system_eventName: 'journey_finished',
      system_elapsedMs: elapsedMs,
      system_journeyId: state.journeyId,
      system_journeyType: journeyType,
    }
    const sent = this.safeAddPageAction(journeyType, payload)
    delete this.journeys[journeyType]
    if (sent) {
      this.newRelic.forceHarvestNow()
    }
    if (runtimeEnvironment.debugger) {
      console.debug(
        `[RUM][journey:${journeyType}] : finished\n${rumDebugJson(payload)}`
      )
    }
  }
}
