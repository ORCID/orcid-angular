import { inject, TestBed, waitForAsync } from '@angular/core/testing'
import { GoogleTagManagerService } from './google-tag-manager.service'
import { ItemGTM } from '../../types/item_gtm'

describe('GoogleTagManagerService', () => {
  let service: GoogleTagManagerService;
  const tag: ItemGTM = { event: 'page' };

  let browserGlobals = {
    windowRef(): any {
      return window
    },
    documentRef(): any {
      return document
    },
  }

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          GoogleTagManagerService,
        ]
      });
      browserGlobals.windowRef().dataLayer = [];
    })
  );

  it('should be created',
    inject([GoogleTagManagerService], (service: GoogleTagManagerService) => {
      expect(service).toBeTruthy();
    }));

  it('should provide a dataLayer taken from the global window variable',
    inject([GoogleTagManagerService], (service: GoogleTagManagerService) => {
      expect(service.getDataLayer()).toEqual([]);
      browserGlobals.windowRef().dataLayer = [tag];
      expect(service.getDataLayer()).toEqual([tag]);
    }));

  it('should be able to add script element',
    inject([GoogleTagManagerService], (service: GoogleTagManagerService) => {
      service.pushTag(tag).subscribe(() => {
        const script = document.querySelector('#GTM');
        expect(script).toBeTruthy();
        expect(script.getAttribute('src')).toContain('https://www.googletagmanager.com/gtm.js?id=');
      });
    }));


  it('should be push tags in the dataLayer',
    inject([GoogleTagManagerService], (service: GoogleTagManagerService) => {
      return service.pushTag(tag).subscribe(() => {
        expect(browserGlobals.windowRef().dataLayer[1]).toEqual(tag);
        expect(browserGlobals.windowRef().dataLayer[2]).toBeFalsy();
      });
    }));
});
