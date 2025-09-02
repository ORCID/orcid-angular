import { Injectable } from '@angular/core'

export type FeatureLogLevel = 'info' | 'warn' | 'error' | 'debug'

@Injectable({ providedIn: 'root' })
export class FeatureLoggerService {
  /**
   * Logs an informational message like: [Feature] details
   */
  info(feature: string, ...details: unknown[]): void {
    if (this.shouldLog('info')) {
      // Keep the same shape used across the app (separate args over string concat)
      console.info(`[${feature}]`, ...details)
    }
  }

  /**
   * Logs a warning message like: [Feature] details
   */
  warn(feature: string, ...details: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(`[${feature}]`, ...details)
    }
  }

  /**
   * Logs an error message like: [Feature] details
   */
  error(feature: string, ...details: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(`[${feature}]`, ...details)
    }
  }

  /**
   * Logs a debug message like: [Feature] details
   */
  debug(feature: string, ...details: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.info(`[${feature}]`, ...details)
    }
  }

  /**
   * Returns a scoped logger that automatically prefixes with [Feature]
   * Usage:
   *   const authLog = featureLogger.scoped('Auth')
   *   authLog.info('Starting flow', state)
   */
  scoped(feature: string) {
    return {
      info: (...details: unknown[]) => this.info(feature, ...details),
      warn: (...details: unknown[]) => this.warn(feature, ...details),
      error: (...details: unknown[]) => this.error(feature, ...details),
      debug: (...details: unknown[]) => this.debug(feature, ...details),
    }
  }

  private shouldLog(level: FeatureLogLevel): boolean {
    // Align with interstitials manager behavior: only log when debugger flag is on
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbg = (globalThis as any)?.runtimeEnvironment?.debugger
    return !!dbg
  }
}


