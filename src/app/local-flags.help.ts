import { QaFlag } from './core/qa-flag/qa-flags.enum'

// 1) Tell TypeScript that window.setQAflag will exist
declare global {
  interface Window {
    setQAflag(flagName: string, value: boolean): void
  }
}

/**
 * defineGlobalSetQAflag attaches a setQAflag function to the window object.
 * This function will check against our known QaFlag enum values before storing.
 */
export function defineGlobalSetQAflag(): void {
  const knownFlags = Object.values(QaFlag)

  // Attach setQAflag to the window object
  window.setQAflag = (flagName: string, value: boolean) => {
    if (!knownFlags.includes(flagName as QaFlag)) {
      console.warn(
        `[QAFlag] Unknown flag "${flagName}". Known flags: ${knownFlags.join(
          ', '
        )}`
      )
      return
    }

    try {
      if (value) {
        // If the value is true, set the flag in localStorage
        localStorage.setItem(flagName, 'true')
        console.info(`[QAFlag] "${flagName}" set to "${value}".`)
      } else {
        // If the value is false, remove the flag from localStorage
        localStorage.removeItem(flagName)
        console.info(`[QAFlag] "${flagName}" removed from localStorage.`)
      }
    } catch (err) {
      console.error('[QAFlag] Error setting flag in localStorage:', err)
    }
  }
}
