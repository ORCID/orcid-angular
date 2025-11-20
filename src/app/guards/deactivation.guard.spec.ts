import { TestBed } from '@angular/core/testing'
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { DeactivationGuard } from './deactivation.guard'
import { RouterTestingModule } from '@angular/router/testing'
const ApplicationRoutes = {
  home: '',
}

describe('DeactivationGuard', () => {
  let guard: DeactivationGuard
  let router: Router
  const createMockRouteSnapshot = (hasToken: boolean) => {
    return {
      queryParamMap: {
        has: (param: string) => param === 'token' && hasToken,
      },
    } as unknown as ActivatedRouteSnapshot
  }

  const mockStateSnapshot = {} as RouterStateSnapshot

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [DeactivationGuard],
    })
    guard = TestBed.inject(DeactivationGuard)
    router = TestBed.inject(Router)
  })

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })

  it('should return true if the "token" query parameter exists', () => {
    const mockRoute = createMockRouteSnapshot(true)
    const result = guard.canActivate(mockRoute, mockStateSnapshot)
    expect(result).toBe(true)
  })

  it('should return a UrlTree to home if the "token" query parameter does not exist', () => {
    const mockRoute = createMockRouteSnapshot(false)
    const routerSpy = spyOn(router, 'createUrlTree').and.callThrough()
    const result = guard.canActivate(mockRoute, mockStateSnapshot) as UrlTree
    expect(routerSpy).toHaveBeenCalledWith([ApplicationRoutes.home])
    expect(result instanceof UrlTree).toBeTrue()
    expect(router.serializeUrl(result)).toBe('/')
  })
})
