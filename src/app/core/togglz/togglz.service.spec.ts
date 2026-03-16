import { TestBed } from '@angular/core/testing'
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'
import { TogglzService } from './togglz.service'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { TogglzFlag } from 'src/app/types/config.endpoint'

const API_WEB = 'https://test.orcid.org/'

function configWithMessages(messages: Record<string, string>): { messages: Record<string, string> } {
  return { messages }
}

describe('TogglzService', () => {
  let httpMock: HttpTestingController
  let service: TogglzService
  let sessionStorageMock: Record<string, string>

  beforeEach(() => {
    ;(window as any).runtimeEnvironment = { API_WEB }

    sessionStorageMock = {}
    spyOn(sessionStorage, 'getItem').and.callFake((key: string) =>
      sessionStorageMock[key] ?? null
    )
    spyOn(sessionStorage, 'setItem').and.callFake((key: string, value: string) => {
      sessionStorageMock[key] = value
    })

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        WINDOW_PROVIDERS,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
    })

    httpMock = TestBed.inject(HttpTestingController)
    service = TestBed.inject(TogglzService)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('getStateOf (feature value: true/false or percentage 0-100)', () => {
    /**
     * Subscribe to getStateOf first so getTogglz() runs and the HTTP pipeline is set up,
     * then trigger the config request and flush the response.
     */
    function subscribeThenTriggerConfigAndFlush(
      messages: Record<string, string>,
      assert: (result: boolean) => void,
      done: () => void
    ) {
      service.getStateOf(TogglzFlag.RUM).subscribe((result) => {
        assert(result)
        done()
      })
      service.reportUserStatusChecked(1)
      const req = httpMock.expectOne((r) =>
        r.url.startsWith(API_WEB) && r.url.includes('config.json')
      )
      req.flush(configWithMessages(messages))
    }

    it('returns true when value is "true"', (done) => {
      subscribeThenTriggerConfigAndFlush(
        { [TogglzFlag.RUM]: 'true' },
        (result) => expect(result).toBe(true),
        done
      )
    })

    it('returns true when value is "100"', (done) => {
      subscribeThenTriggerConfigAndFlush(
        { [TogglzFlag.RUM]: '100' },
        (result) => expect(result).toBe(true),
        done
      )
    })

    it('returns false when value is "false"', (done) => {
      subscribeThenTriggerConfigAndFlush(
        { [TogglzFlag.RUM]: 'false' },
        (result) => expect(result).toBe(false),
        done
      )
    })

    it('returns false when value is "0"', (done) => {
      subscribeThenTriggerConfigAndFlush(
        { [TogglzFlag.RUM]: '0' },
        (result) => expect(result).toBe(false),
        done
      )
    })

    it('for percentage value, returns stored decision from sessionStorage when present', (done) => {
      sessionStorageMock[`togglz-sample-${TogglzFlag.RUM}`] = 'true'
      subscribeThenTriggerConfigAndFlush(
        { [TogglzFlag.RUM]: '50' },
        (result) => expect(result).toBe(true),
        done
      )
    })

    it('for percentage value, returns false when sessionStorage has "false"', (done) => {
      sessionStorageMock[`togglz-sample-${TogglzFlag.RUM}`] = 'false'
      subscribeThenTriggerConfigAndFlush(
        { [TogglzFlag.RUM]: '50' },
        (result) => expect(result).toBe(false),
        done
      )
    })

    it('for percentage value with no stored decision, computes sample and persists to sessionStorage', (done) => {
      const randomSpy = spyOn(Math, 'random').and.returnValue(0.3)
      subscribeThenTriggerConfigAndFlush(
        { [TogglzFlag.RUM]: '50' },
        (result) => {
          expect(result).toBe(true)
          expect(sessionStorage.setItem).toHaveBeenCalledWith(
            `togglz-sample-${TogglzFlag.RUM}`,
            'true'
          )
          randomSpy.calls.reset()
        },
        done
      )
    })

    it('for percentage value when random is above threshold, returns false and persists', (done) => {
      spyOn(Math, 'random').and.returnValue(0.6)
      subscribeThenTriggerConfigAndFlush(
        { [TogglzFlag.RUM]: '50' },
        (result) => {
          expect(result).toBe(false)
          expect(sessionStorage.setItem).toHaveBeenCalledWith(
            `togglz-sample-${TogglzFlag.RUM}`,
            'false'
          )
        },
        done
      )
    })
  })
})
