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
  signin: 'signin',
}

describe('ResetPasswordGuard', () => {
  let guard: ResetPasswordGuard
  let router: Router
  const createMockRouteSnapshot = (key: string | null) => {
    return {
      params: {
        key: key,
      },
    } as unknown as ActivatedRouteSnapshot
  }

  const mockStateSnapshot = {} as RouterStateSnapshot

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [ResetPasswordGuard],
    })
    guard = TestBed.inject(ResetPasswordGuard)
    router = TestBed.inject(Router)
  })

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })

  it('should return true if the "key" query parameter exists', () => {
    const mockRoute = createMockRouteSnapshot('some-token-value')
    const result = guard.canActivate(mockRoute, mockStateSnapshot)
    expect(result).toBeTruthy()
  })

  it('should return a UrlTree to signin if the "key" query parameter does not exist', () => {
    const mockRoute = createMockRouteSnapshot(null)
    const routerSpy = spyOn(router, 'createUrlTree').and.callThrough()

    const result = guard.canActivate(mockRoute, mockStateSnapshot)
    expect(routerSpy).toHaveBeenCalledWith([ApplicationRoutes.signin])
    expect(result instanceof UrlTree).toBeTrue()
  })
})
