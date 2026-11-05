import { TestBed } from '@angular/core/testing'
import { ROUTES, Route } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'

import { AuthenticatedNoDelegatorGuard } from '../guards/authenticated-no-delagator.guard'
import { RecoveryPhoneComponent } from './pages/recovery-phone/recovery-phone.component'
import { TwoFactorRecoveryPhoneRoutingModule } from './two-factor-recovery-phone-routing.module'

describe('TwoFactorRecoveryPhoneRoutingModule', () => {
  it('keeps a delegate off the add-and-manage page, as Account settings does (F4.5)', () => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TwoFactorRecoveryPhoneRoutingModule],
    })

    const routes: Route[] = ([] as Route[]).concat(...TestBed.inject(ROUTES))
    const page = routes.find(
      (route) => route.component === RecoveryPhoneComponent
    )

    expect(page).toBeTruthy()
    expect(page.canActivate).toContain(AuthenticatedNoDelegatorGuard)
  })
})
