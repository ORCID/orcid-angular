import { TestBed } from '@angular/core/testing'
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { InboxService } from './inbox.service'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { InboxCacheService } from './inbox-cache.service'
import {
  InboxNotificationItem,
  TotalNotificationCount,
} from '../../types/notifications.endpoint'

declare const runtimeEnvironment: { BASE_URL: string }

describe('InboxService', () => {
  let service: InboxService
  let httpController: HttpTestingController
  let cache: InboxCacheService

  const BASE_URL = 'https://test.orcid.org/'

  beforeEach(() => {
    ;(window as any).runtimeEnvironment = { BASE_URL }

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        InboxService,
        InboxCacheService,
        WINDOW_PROVIDERS,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
    })
    service = TestBed.inject(InboxService)
    httpController = TestBed.inject(HttpTestingController)
    cache = TestBed.inject(InboxCacheService)
  })

  afterEach(() => {
    httpController.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('getUnreadCount', () => {
    it('should fetch unread count and return it', (done) => {
      service.getUnreadCount().subscribe((count) => {
        expect(count).toBe(5)
        done()
      })

      const req = httpController.expectOne((r) =>
        r.url?.includes('inbox/unreadCount.json')
      )
      expect(req.request.method).toBe('GET')
      req.flush(5)
    })

    it('should return null on HTTP error', (done) => {
      service.getUnreadCount().subscribe((count) => {
        expect(count).toBeNull()
        done()
      })

      const req = httpController.expectOne((r) =>
        r.url?.includes('inbox/unreadCount.json')
      )
      req.error(new ProgressEvent('error'), {
        status: 500,
        statusText: 'Server Error',
      })
    })
  })

  describe('flagAsRead', () => {
    it('should POST to read endpoint and return updated notification', (done) => {
      const updated = {
        putCode: 123,
        readDate: 9999,
        notificationType: 'PERMISSION',
      } as InboxNotificationItem

      service.flagAsRead(123).subscribe((result) => {
        expect(result.putCode).toBe(123)
        expect(result.readDate).toBe(9999)
        done()
      })

      const req = httpController.expectOne((r) =>
        r.url?.includes('inbox/123/read.json')
      )
      expect(req.request.method).toBe('POST')
      expect(req.request.body).toBe('123')
      req.flush(updated)
    })
  })

  describe('fetchNotificationsPage', () => {
    it('should fetch first page with correct query params', (done) => {
      const notifications: InboxNotificationItem[] = []

      service.fetchNotificationsPage(0, false).subscribe((result) => {
        expect(result).toEqual(notifications)
        done()
      })

      const req = httpController.expectOne((r) =>
        r.url?.includes('inbox/notifications.json')
      )
      expect(req.request.url).toContain('firstResult=0')
      expect(req.request.url).toContain('maxResults=10')
      expect(req.request.url).toContain('includeArchived=false')
      req.flush(notifications)
    })

    it('should use cache on second call for same params', (done) => {
      const notifications: InboxNotificationItem[] = []

      service.fetchNotificationsPage(0, false).subscribe(() => {})
      const req1 = httpController.expectOne((r) =>
        r.url?.includes('inbox/notifications.json')
      )
      req1.flush(notifications)

      service.fetchNotificationsPage(0, false).subscribe((result) => {
        expect(result).toEqual(notifications)
        done()
      })
      httpController.expectNone((r) => r.url?.includes('notifications.json'))
    })
  })

  describe('fetchNotificationsIncremental', () => {
    it('should fetch totalCount first then pages until done', (done) => {
      const totalCount: TotalNotificationCount = {
        all: 15,
        nonArchived: 15,
      }
      const page1: InboxNotificationItem[] = Array(10)
        .fill(null)
        .map((_, i) => ({ putCode: i, notificationType: 'PERMISSION' } as any))
      const page2: InboxNotificationItem[] = Array(5)
        .fill(null)
        .map(
          (_, i) => ({ putCode: i + 10, notificationType: 'PERMISSION' } as any)
        )

      cache.clearTotalCount('test')
      cache.clearNotificationsPage('test')

      service.fetchNotificationsIncremental(false).subscribe((ev) => {
        if (ev.done) {
          expect(ev.total).toBe(15)
          expect(ev.notifications.length).toBe(15)
          done()
        }
      })

      const totalReq = httpController.expectOne((r) =>
        r.url?.includes('inbox/totalCount.json')
      )
      totalReq.flush(totalCount)

      const page1Req = httpController.expectOne((r) => {
        const url = r.url || ''
        return (
          url.includes('notifications.json') && url.includes('firstResult=0')
        )
      })
      page1Req.flush(page1)

      const page2Req = httpController.expectOne((r) => {
        const url = r.url || ''
        return (
          url.includes('notifications.json') && url.includes('firstResult=10')
        )
      })
      page2Req.flush(page2)
    })

    it('should return empty when totalCount has no nonArchived', (done) => {
      const totalCount: TotalNotificationCount = { all: 0, nonArchived: 0 }

      cache.clearTotalCount('test')

      service.fetchNotificationsIncremental(false).subscribe((ev) => {
        expect(ev.total).toBe(0)
        expect(ev.notifications).toEqual([])
        expect(ev.done).toBe(true)
        done()
      })

      const totalReq = httpController.expectOne((r) =>
        r.url?.includes('inbox/totalCount.json')
      )
      totalReq.flush(totalCount)
    })
  })

  describe('flagAsArchive', () => {
    it('should POST to archive endpoint', (done) => {
      const archived = {
        putCode: 456,
        archivedDate: 8888,
        notificationType: 'PERMISSION',
      } as InboxNotificationItem

      service.flagAsArchive(456).subscribe((result) => {
        expect(result.archivedDate).toBe(8888)
        done()
      })

      const req = httpController.expectOne((r) =>
        r.url?.includes('inbox/456/archive.json')
      )
      expect(req.request.method).toBe('POST')
      req.flush(archived)
    })
  })
})
