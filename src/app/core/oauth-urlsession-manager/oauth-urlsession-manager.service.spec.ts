import { TestBed } from '@angular/core/testing'

import { OauthURLSessionManagerService } from './oauth-urlsession-manager.service'

const JUST_REGISTERED_KEY = 'oauthJustRegistered'
const PASSWORD_JUST_RESET_KEY = 'passwordJustReset'

describe('OauthURLSessionManagerService', () => {
  let service: OauthURLSessionManagerService

  beforeEach(() => {
    localStorage.removeItem(JUST_REGISTERED_KEY)
    TestBed.configureTestingModule({})
    service = TestBed.inject(OauthURLSessionManagerService)
  })

  afterEach(() => {
    localStorage.removeItem(JUST_REGISTERED_KEY)
    localStorage.removeItem(PASSWORD_JUST_RESET_KEY)
  })

  describe('consumePasswordJustReset (PD-14612)', () => {
    it('returns the flag once and clears storage (R8.3)', () => {
      service.setPasswordJustReset()

      expect(service.consumePasswordJustReset()).toBeTrue()
      expect(localStorage.getItem(PASSWORD_JUST_RESET_KEY)).toBeNull()
      expect(service.consumePasswordJustReset()).toBeFalse()
    })

    it('is false when nothing was stored', () => {
      expect(service.consumePasswordJustReset()).toBeFalse()
    })

    it('is false and cleared once the flag is older than five minutes', () => {
      jasmine.clock().install()
      jasmine.clock().mockDate(new Date(2026, 9, 28, 12, 0, 0))
      service.setPasswordJustReset()
      jasmine.clock().tick(5 * 60 * 1000 + 1)

      expect(service.consumePasswordJustReset()).toBeFalse()
      expect(localStorage.getItem(PASSWORD_JUST_RESET_KEY)).toBeNull()
      jasmine.clock().uninstall()
    })

    it('survives clear(), which the OAuth branch of the reset calls (R8.2)', () => {
      service.setPasswordJustReset()
      service.clear()

      expect(service.consumePasswordJustReset()).toBeTrue()
    })

    it('is false for a malformed payload', () => {
      localStorage.setItem(PASSWORD_JUST_RESET_KEY, '{not json')

      expect(service.consumePasswordJustReset()).toBeFalse()
    })

    it('is false, and does not throw, when storage refuses to be read', () => {
      spyOn(Storage.prototype, 'getItem').and.throwError('SecurityError')

      expect(service.consumePasswordJustReset()).toBeFalse()
    })

    it('does not throw when storage refuses to be written', () => {
      spyOn(Storage.prototype, 'setItem').and.throwError('QuotaExceededError')

      expect(() => service.setPasswordJustReset()).not.toThrow()
    })
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('consumeJustRegistered', () => {
    it('returns the flag and clears storage', () => {
      service.setJustRegistered(true)

      expect(service.consumeJustRegistered()).toBeTrue()
      expect(localStorage.getItem(JUST_REGISTERED_KEY)).toBeNull()
      // One-time by contract: the stored flag is gone for the next caller
      expect(service.consumeJustRegistered()).toBeFalse()
    })

    it('returns false and still clears an expired flag', () => {
      localStorage.setItem(
        JUST_REGISTERED_KEY,
        JSON.stringify({ value: true, expiresAt: Date.now() - 1000 })
      )

      expect(service.consumeJustRegistered()).toBeFalse()
      expect(localStorage.getItem(JUST_REGISTERED_KEY)).toBeNull()
    })
  })

  describe('isJustRegistered', () => {
    it('reads the stored flag without removing it', () => {
      service.setJustRegistered(true)

      expect(service.isJustRegistered()).toBeTrue()
      expect(localStorage.getItem(JUST_REGISTERED_KEY)).not.toBeNull()
      // Repeatable, unlike consumeJustRegistered
      expect(service.isJustRegistered()).toBeTrue()
    })

    it('stays true after consumeJustRegistered has cleared storage', () => {
      service.setJustRegistered(true)

      expect(service.consumeJustRegistered()).toBeTrue()
      expect(localStorage.getItem(JUST_REGISTERED_KEY)).toBeNull()
      expect(service.isJustRegistered()).toBeTrue()
    })

    it('is false when nothing was ever stored', () => {
      expect(service.isJustRegistered()).toBeFalse()
    })

    it('is false for an expired flag', () => {
      localStorage.setItem(
        JUST_REGISTERED_KEY,
        JSON.stringify({ value: true, expiresAt: Date.now() - 1000 })
      )

      expect(service.isJustRegistered()).toBeFalse()
    })

    it('is false for a malformed payload', () => {
      localStorage.setItem(JUST_REGISTERED_KEY, 'not json')

      expect(service.isJustRegistered()).toBeFalse()
    })

    it('is false when the flag was stored as false', () => {
      service.setJustRegistered(false)

      expect(service.isJustRegistered()).toBeFalse()
    })

    it('is false once an already-expired flag was consumed', () => {
      localStorage.setItem(
        JUST_REGISTERED_KEY,
        JSON.stringify({ value: true, expiresAt: Date.now() - 1000 })
      )

      expect(service.consumeJustRegistered()).toBeFalse()
      expect(service.isJustRegistered()).toBeFalse()
    })

    it('is not resurrected by clear()', () => {
      service.setJustRegistered(true)
      service.clear()

      expect(service.isJustRegistered()).toBeFalse()
    })
  })
})
