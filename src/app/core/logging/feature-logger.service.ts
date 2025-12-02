import { Injectable } from '@angular/core'

export type FeatureLogLevel = 'info' | 'warn' | 'error' | 'debug'

@Injectable({ providedIn: 'root' })
export class FeatureLoggerService {
  /**
   * Logs an informational message like: [Feature] details
   */
  info(feature: string, ...details: unknown[]): void {
    if (this.shouldLog('info')) {
      // Print each detail on its own line, arrays indented recursively
      const body = this.formatDetails(details)
      if (body) {
        console.info(`[${feature}]`, `\n${body}`)
      } else {
        console.info(`[${feature}]`)
      }
    }
  }

  /**
   * Logs a warning message like: [Feature] details
   */
  warn(feature: string, ...details: unknown[]): void {
    if (this.shouldLog('warn')) {
      const body = this.formatDetails(details)
      if (body) {
        console.warn(`[${feature}]`, `\n${body}`)
      } else {
        console.warn(`[${feature}]`)
      }
    }
  }

  /**
   * Logs an error message like: [Feature] details
   */
  error(feature: string, ...details: unknown[]): void {
    if (this.shouldLog('error')) {
      const body = this.formatDetails(details)
      if (body) {
        console.error(`[${feature}]`, `\n${body}`)
      } else {
        console.error(`[${feature}]`)
      }
    }
  }

  /**
   * Logs a debug message like: [Feature] details
   */
  debug(feature: string, ...details: unknown[]): void {
    if (this.shouldLog('debug')) {
      const body = this.formatDetails(details)
      if (body) {
        console.info(`[${feature}]`, `\n${body}`)
      } else {
        console.info(`[${feature}]`)
      }
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

  private formatDetails(details: unknown[], indent = 0): string {
    const lines: string[] = []
    const prefix = '  '.repeat(indent)
    for (const part of details) {
      if (Array.isArray(part)) {
        if (part.length === 0) {
          // Represent empty arrays explicitly
          lines.push(`${prefix}- []`)
        } else {
          const nested = this.formatDetails(part, indent + 1)
          if (nested) {
            lines.push(nested)
          }
        }
      } else {
        lines.push(`${prefix}- ${this.stringifyForLine(part)}`)
      }
    }
    return lines.join('\n')
  }

  private stringifyForLine(value: unknown): string {
    if (typeof value === 'string') return value
    if (value instanceof Error) return value.stack || value.message
    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }

  private shouldLog(level: FeatureLogLevel): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbg = (globalThis as any)?.runtimeEnvironment?.debugger
    return !!dbg
  }
}
