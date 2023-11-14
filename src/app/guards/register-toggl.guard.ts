import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { combineLatest, Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { ApplicationRoutes } from '../constants'
import { UserService } from '../core'
import { TogglzService } from '../core/togglz/togglz.service'

@Injectable({
  providedIn: 'root',
})
export class RegisterTogglGuard {
  constructor(
    private _userInfo: UserService,
    private _router: Router,
    private _togglz: TogglzService
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return false
  }
}
