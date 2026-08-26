import { TestBed } from '@angular/core/testing'

import { OauthURLSessionManagerService } from './oauth-urlsession-manager.service'

const JUST_REGISTERED_KEY = 'oauthJustRegistered'

describe('OauthURLSessionManagerService', () => {
  let service: OauthURLSessionManagerService

  beforeEach(() => {
    localStorage.removeItem(JUST_REGISTERED_KEY)
    TestBed.configureTestingModule({})
    service = TestBed.inject(OauthURLSessionManagerService)
  })

  afterEach(() => {
    localStorage.removeItem(JUST_REGISTERED_KEY)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('isJustRegistered', () => {
    it('reads the stored flag without removing it', () => {
      service.setJustRegistered(true)

      expect(service.isJustRegistered()).toBeTrue()
      expect(localStorage.getItem(JUST_REGISTERED_KEY)).not.toBeNull()
      // A second read still works, unlike consumeJustRegistered
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

    it('is false once the flag was consumed while already expired', () => {
      localStorage.setItem(
        JUST_REGISTERED_KEY,
        JSON.stringify({ value: true, expiresAt: Date.now() - 1000 })
      )

      expect(service.consumeJustRegistered()).toBeFalse()
      expect(service.isJustRegistered()).toBeFalse()
    })
  })
})
