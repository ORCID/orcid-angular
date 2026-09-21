import { discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing'

import {
  RECOVERY_PHONE_ELEVATION_TTL_MILLIS,
  recoveryPhoneElevationExpiry,
} from './recovery-phone-elevation'

describe('recoveryPhoneElevationExpiry', () => {
  const TTL = RECOVERY_PHONE_ELEVATION_TTL_MILLIS

  it('is the eight minutes the registry allows', () => {
    expect(TTL).toBe(8 * 60 * 1000)
  })

  it('says nothing until the window has run out', fakeAsync(() => {
    const expired = jasmine.createSpy('expired')
    recoveryPhoneElevationExpiry(Date.now()).subscribe(expired)

    tick(TTL - 1)
    expect(expired).not.toHaveBeenCalled()

    tick(1)
    expect(expired).toHaveBeenCalledTimes(1)
  }))

  it('counts from the grant, so a late subscriber waits only the remainder', fakeAsync(() => {
    const expired = jasmine.createSpy('expired')
    recoveryPhoneElevationExpiry(Date.now() - 5 * 60 * 1000).subscribe(expired)

    tick(3 * 60 * 1000 - 1)
    expect(expired).not.toHaveBeenCalled()

    tick(1)
    expect(expired).toHaveBeenCalledTimes(1)
  }))

  it('fires at once when the grant is already stale', fakeAsync(() => {
    const expired = jasmine.createSpy('expired')
    recoveryPhoneElevationExpiry(Date.now() - TTL - 60 * 1000).subscribe(
      expired
    )

    tick(0)
    expect(expired).toHaveBeenCalledTimes(1)
  }))

  it('measures the remainder when something subscribes, not when it was built', fakeAsync(() => {
    // A host that builds the observable on init and subscribes later must not
    // be handed a full window; the clock belongs to the grant, not to the
    // moment this function was called.
    const expired = jasmine.createSpy('expired')
    const expiry = recoveryPhoneElevationExpiry(Date.now())

    tick(2 * 60 * 1000)
    expiry.subscribe(expired)

    tick(6 * 60 * 1000 - 1)
    expect(expired).not.toHaveBeenCalled()

    tick(1)
    expect(expired).toHaveBeenCalledTimes(1)
  }))

  it('fires once and then stops', fakeAsync(() => {
    const expired = jasmine.createSpy('expired')
    recoveryPhoneElevationExpiry(Date.now()).subscribe(expired)

    tick(TTL * 3)

    expect(expired).toHaveBeenCalledTimes(1)
    discardPeriodicTasks()
  }))
})
