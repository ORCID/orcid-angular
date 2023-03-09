import { inject, TestBed, waitForAsync } from '@angular/core/testing'
import { GoogleTagManagerService } from './google-tag-manager.service'
import { ItemGTM } from '../../types/item_gtm'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { PlatformInfoService } from '../../cdk/platform-info'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../cdk/window'

describe('GoogleTagManagerService', () => {
  let service: GoogleTagManagerService
  const tag: ItemGTM = { event: 'page' }

  let browserGlobals = {
    windowRef(): any {
      return window
    },
    documentRef(): any {
      return document
    },
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        WINDOW_PROVIDERS,
        GoogleTagManagerService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
    })
    browserGlobals.windowRef().dataLayer = []
  }))

  it('should be created', inject(
    [GoogleTagManagerService],
    (service: GoogleTagManagerService) => {
      expect(service).toBeTruthy()
    }
  ))

  it('should be able to add script element and throw error because cannot connect with GTM', inject(
    [GoogleTagManagerService],
    (service: GoogleTagManagerService) => {
      service.addGtmToDom().subscribe(
        () => {
          const script = document.querySelector('#GTM')
          expect(script).toBeTruthy()
          expect(script.getAttribute('src')).toContain(
            'https://www.googletagmanager.com/gtm.js?id='
          )
        },
        (error) => {
          expect(error).toEqual({
            name: 'GTM - Error',
            message: 'Unable to add GTM',
          })
        }
      )
    }
  ))

  it('should be push tags in the dataLayer', inject(
    [GoogleTagManagerService],
    (service: GoogleTagManagerService) => {
      return service.pushTag(tag).subscribe(
        () => {
          expect(browserGlobals.windowRef().dataLayer[1]).toEqual(tag)
          expect(browserGlobals.windowRef().dataLayer[2]).toBeFalsy()
        },
        (error) => {
          expect(error).toEqual({
            name: 'GTM - Error',
            message: 'Unable to add GTM',
          })
        }
      )
    }
  ))
})
