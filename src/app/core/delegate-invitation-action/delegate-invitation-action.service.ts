import { Inject, Injectable } from '@angular/core'
import { WINDOW } from '../../cdk/window'

export interface DelegateInvitationAction {
  token: string
  decision: 'ACCEPT' | 'DECLINE'
}

@Injectable({ providedIn: 'root' })
export class DelegateInvitationActionService {
  private readonly storageKey = 'delegateInvitationAction'

  constructor(@Inject(WINDOW) private window: Window) {}

  valid(token: string, decision: string): decision is 'ACCEPT' | 'DECLINE' {
    return (
      /^[A-Za-z0-9_-]{1,2000}(\.[A-Za-z0-9_-]{1,2000}){2}$/.test(token || '') &&
      (decision === 'ACCEPT' || decision === 'DECLINE')
    )
  }

  save(action: DelegateInvitationAction): void {
    this.window.sessionStorage.setItem(this.storageKey, JSON.stringify(action))
  }

  get(): DelegateInvitationAction | null {
    try {
      const action = JSON.parse(
        this.window.sessionStorage.getItem(this.storageKey) || 'null'
      )
      return action && this.valid(action.token, action.decision) ? action : null
    } catch {
      return null
    }
  }

  clear(): void {
    this.window.sessionStorage.removeItem(this.storageKey)
  }
}
