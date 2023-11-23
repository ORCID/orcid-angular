import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable } from 'rxjs'
import { delay, map } from 'rxjs/operators'

import { UserService } from '../core'
import { TogglzService } from '../core/togglz/togglz.service'

@Injectable({
  providedIn: 'root',
})
export class RegisterTogglGuard {
  constructor(
    private _user: UserService,
    private _router: Router,
    private _togglz: TogglzService
  ) {}

  canMatch(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | UrlTree | boolean {
    return this._togglz.getStateOf('REGISTRATION_2_0').pipe(
      map((session) => {
        if (session) {
          localStorage.setItem('REGISTRATION_2_0', 'enabled')
        } else {
          localStorage.removeItem('REGISTRATION_2_0')
        }

        console.log('writed!')
        // PLEASE NOTE THE PURPOSE OF THIS GUARD IS TO SET THE 'REGISTRATION_2_0' togglz
        // before the registration module is loaded.
        // This is done by setting the localStorage item 'REGISTRATION_2_0'.

        // DESPITE OF THIS BEEN A GUARD, IT DOES NOT PREVENT THE USER FROM ACCESSING THE REGISTRATION MODULE.
        // IT JUST HELPS SETTING THE LOGIC TWO WHICH VERSION OF THE REGISTRATION MODULE SHOULD BE LOADED.

        return true
      })
    )
  }
}
