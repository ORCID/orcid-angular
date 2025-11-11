import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable } from 'rxjs'

import { ApplicationRoutes } from '../constants'

@Injectable({
  providedIn: 'root',
})
export class DeactivationGuard {
  constructor(private _router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return (
      next.queryParamMap.has('token') ||
      this._router.createUrlTree([ApplicationRoutes.home])
    )
  }
}
