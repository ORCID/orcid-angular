import { TestBed } from '@angular/core/testing'
import { Router, UrlTree } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { Observable, of } from 'rxjs'

import { AuthenticatedNoDelegatorGuard } from './authenticated-no-delagator.guard'
import { ApplicationRoutes } from '../constants'
import { UserService } from '../core'
import { TogglzService } from '../core/togglz/togglz.service'

describe('AuthenticatedNoDelegatorGuard', () => {
  let guard: AuthenticatedNoDelegatorGuard
  let router: Router
  let session: any

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {
          provide: UserService,
          useValue: { getUserSession: () => of(session) },
        },
        { provide: TogglzService, useValue: {} },
      ],
    })
    guard = TestBed.inject(AuthenticatedNoDelegatorGuard)
    router = TestBed.inject(Router)
  })

  function decide(): boolean | UrlTree {
    let decision: boolean | UrlTree
    ;(guard.canActivate(null, null) as Observable<boolean | UrlTree>).subscribe(
      (value) => (decision = value)
    )
    return decision
  }

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })

  it('lets the record owner through', () => {
    session = {
      loggedIn: true,
      userInfo: { IN_DELEGATION_MODE: 'false', DELEGATED_BY_ADMIN: 'false' },
    }

    expect(decide()).toBe(true)
  })

  it('sends a trusted individual acting for the record to my-orcid', () => {
    session = {
      loggedIn: true,
      userInfo: { IN_DELEGATION_MODE: 'true', DELEGATED_BY_ADMIN: 'false' },
    }

    const decision = decide()

    expect(decision instanceof UrlTree).toBe(true)
    expect(router.serializeUrl(decision as UrlTree)).toBe(
      router.serializeUrl(router.createUrlTree([ApplicationRoutes.myOrcid]))
    )
  })

  it('lets an admin switched into the record through, leaving the number to the server (F4.5)', () => {
    session = {
      loggedIn: true,
      userInfo: { IN_DELEGATION_MODE: 'true', DELEGATED_BY_ADMIN: 'true' },
    }

    expect(decide()).toBe(true)
  })
})
