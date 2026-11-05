import { TestBed } from '@angular/core/testing'

import { RecoveryPhoneNoticeService } from './recovery-phone-notice.service'
import { WINDOW } from '../../cdk/window'

describe('RecoveryPhoneNoticeService', () => {
  const orcid = '0000-0001-0002-0003'
  let store: Record<string, string>
  let localStorageStub: Storage

  function configure(storage: Partial<Storage>) {
    TestBed.configureTestingModule({
      providers: [{ provide: WINDOW, useValue: { localStorage: storage } }],
    })
    return TestBed.inject(RecoveryPhoneNoticeService)
  }

  beforeEach(() => {
    store = {}
    localStorageStub = {
      getItem: (key: string) => (key in store ? store[key] : null),
      setItem: (key: string, value: string) => {
        store[key] = value
      },
      removeItem: (key: string) => {
        delete store[key]
      },
    } as unknown as Storage
  })

  it('keys the flag by the account it belongs to', () => {
    const service = configure(localStorageStub)

    service.markTwoFactorDisabled(orcid)

    expect(store['0000-0001-0002-0003_2FA_DISABLED_BY_RECOVERY_PHONE']).toBe(
      'true'
    )
  })

  it('reports the notice once and then forgets it', () => {
    const service = configure(localStorageStub)
    service.markTwoFactorDisabled(orcid)

    expect(service.consumeTwoFactorDisabled(orcid)).toBeTrue()
    // a reload of the record must not show it again
    expect(service.consumeTwoFactorDisabled(orcid)).toBeFalse()
    expect(
      store['0000-0001-0002-0003_2FA_DISABLED_BY_RECOVERY_PHONE']
    ).toBeUndefined()
  })

  it('does not show one account the other account notice', () => {
    const service = configure(localStorageStub)
    service.markTwoFactorDisabled(orcid)

    expect(service.consumeTwoFactorDisabled('0000-0009-0009-0009')).toBeFalse()
    expect(service.consumeTwoFactorDisabled(orcid)).toBeTrue()
  })

  it('says no when there is nothing stored', () => {
    const service = configure(localStorageStub)

    expect(service.consumeTwoFactorDisabled(orcid)).toBeFalse()
  })

  it('ignores an account with no iD', () => {
    const service = configure(localStorageStub)

    service.markTwoFactorDisabled('')

    expect(Object.keys(store).length).toBe(0)
    expect(service.consumeTwoFactorDisabled('')).toBeFalse()
  })

  it('survives a browser that refuses local storage', () => {
    // A private window throws on read and on write rather than returning null
    const throwingStorage = {
      getItem: () => {
        throw new Error('denied')
      },
      setItem: () => {
        throw new Error('denied')
      },
      removeItem: () => {
        throw new Error('denied')
      },
    } as unknown as Storage
    const service = configure(throwingStorage)

    expect(() => service.markTwoFactorDisabled(orcid)).not.toThrow()
    expect(service.consumeTwoFactorDisabled(orcid)).toBeFalse()
  })
})
