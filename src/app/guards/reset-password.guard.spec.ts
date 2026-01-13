import { TestBed } from '@angular/core/testing'
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { ResetPasswordGuard } from './reset-password.guard'
import { RouterTestingModule } from '@angular/router/testing'
const ApplicationRoutes = {
  home: '',
}

describe('ResetPasswordGuard', () => {
  let guard: ResetPasswordGuard
  let router: Router
  const createMockRouteSnapshot = (hasKey: boolean) => {
    return {
      queryParamMap: {
        has: (param: string) => param === 'key' && hasKey,
      },
    } as unknown as ActivatedRouteSnapshot
  }

  const mockStateSnapshot = {} as RouterStateSnapshot

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [ResetPasswordGuard],
    })
    guard = TestBed.inject(ResetPasswordGuard)
    router = TestBed.inject(Router)
  })

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })

  it('should return true if the "key" query parameter exists', () => {
    const mockRoute = createMockRouteSnapshot(true)
    const result = guard.canActivate(mockRoute, mockStateSnapshot)
    expect(result).toBe(true)
  })

  it('should return a UrlTree to home if the "key" query parameter does not exist', () => {
    const mockRoute = createMockRouteSnapshot(false)
    const routerSpy = spyOn(router, 'createUrlTree').and.callThrough()
    const result = guard.canActivate(mockRoute, mockStateSnapshot) as UrlTree
    expect(routerSpy).toHaveBeenCalledWith([ApplicationRoutes.home])
    expect(result instanceof UrlTree).toBeTrue()
    expect(router.serializeUrl(result)).toBe('/')
  })
})
