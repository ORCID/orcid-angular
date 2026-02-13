import { TestBed } from '@angular/core/testing'
import { of, throwError } from 'rxjs'
import { PermissionNotificationsService } from './permission-notifications.service'
import { InboxService } from './inbox.service'
import { InboxNotificationPermission } from '../../types/notifications.endpoint'
import { AccountTrustedOrganizationsService } from '../account-trusted-organizations/account-trusted-organizations.service'

function createPermissionNotification(
  overrides: Partial<InboxNotificationPermission> = {}
): InboxNotificationPermission {
  return {
    notificationType: 'PERMISSION',
    putCode: 1,
    createdDate: null,
    sentDate: 1000,
    source: {
      sourceClientId: { path: 'client-a', uri: '', host: '' } as any,
      sourceName: { content: 'Org A' },
    },
    subject: '',
    authorizationUrl: {} as any,
    items: { items: [] },
    notificationSubject: '',
    notificationIntro: '',
    ...overrides,
  }
}

describe('PermissionNotificationsService', () => {
  let service: PermissionNotificationsService
  let inboxSpy: jasmine.SpyObj<InboxService>
  let trustedOrgsSpy: jasmine.SpyObj<AccountTrustedOrganizationsService>

  beforeEach(() => {
    inboxSpy = jasmine.createSpyObj<InboxService>('InboxService', [
      'getUnreadCount',
      'fetchNotificationsIncremental',
    ])
    trustedOrgsSpy = jasmine.createSpyObj<AccountTrustedOrganizationsService>(
      'AccountTrustedOrganizationsService',
      ['get']
    )
    trustedOrgsSpy.get.and.returnValue(of([]))

    TestBed.configureTestingModule({
      providers: [
        PermissionNotificationsService,
        { provide: InboxService, useValue: inboxSpy },
        {
          provide: AccountTrustedOrganizationsService,
          useValue: trustedOrgsSpy,
        },
      ],
    })
    service = TestBed.inject(PermissionNotificationsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should return empty array when unread count is null', (done) => {
    inboxSpy.getUnreadCount.and.returnValue(of(null))

    service.loadUnreadPermissionNotifications().subscribe((result) => {
      expect(result).toEqual([])
      expect(inboxSpy.fetchNotificationsIncremental).not.toHaveBeenCalled()
      done()
    })
  })

  it('should return empty array when unread count is 0', (done) => {
    inboxSpy.getUnreadCount.and.returnValue(of(0))

    service.loadUnreadPermissionNotifications().subscribe((result) => {
      expect(result).toEqual([])
      expect(inboxSpy.fetchNotificationsIncremental).not.toHaveBeenCalled()
      done()
    })
  })

  it('should fetch and return grouped permission notifications when unread > 0', (done) => {
    const perm1 = createPermissionNotification({
      putCode: 1,
      sentDate: 2000,
      source: {
        sourceClientId: { path: 'client-a' } as any,
        sourceName: { content: 'Org A' },
      },
    })
    const perm2 = createPermissionNotification({
      putCode: 2,
      sentDate: 1000,
      source: {
        sourceClientId: { path: 'client-b' } as any,
        sourceName: { content: 'Org B' },
      },
    })

    inboxSpy.getUnreadCount.and.returnValue(of(5))
    inboxSpy.fetchNotificationsIncremental.and.returnValue(
      of({ total: 5, notifications: [perm1, perm2], done: true })
    )

    service.loadUnreadPermissionNotifications(3).subscribe((result) => {
      expect(result.length).toBe(2)
      expect(result[0].source.sourceClientId.path).toBe('client-a')
      expect(result[1].source.sourceClientId.path).toBe('client-b')
      expect(inboxSpy.fetchNotificationsIncremental).toHaveBeenCalledWith(false)
      expect(trustedOrgsSpy.get).toHaveBeenCalled()
      done()
    })
  })

  it('should filter out notifications from already trusted clientIds', (done) => {
    const perm1 = createPermissionNotification({
      putCode: 1,
      sentDate: 2000,
      source: {
        sourceClientId: { path: 'client-a' } as any,
        sourceName: { content: 'Org A' },
      },
    })
    const perm2 = createPermissionNotification({
      putCode: 2,
      sentDate: 1000,
      source: {
        sourceClientId: { path: 'client-b' } as any,
        sourceName: { content: 'Org B' },
      },
    })

    trustedOrgsSpy.get.and.returnValue(of([{ clientId: 'client-a' } as any]))
    inboxSpy.getUnreadCount.and.returnValue(of(5))
    inboxSpy.fetchNotificationsIncremental.and.returnValue(
      of({ total: 5, notifications: [perm1, perm2], done: true })
    )

    service.loadUnreadPermissionNotifications(3).subscribe((result) => {
      expect(result.length).toBe(1)
      expect(result[0].source.sourceClientId.path).toBe('client-b')
      done()
    })
  })

  it('should not fail if trusted-orgs lookup fails (no filtering applied)', (done) => {
    const perm1 = createPermissionNotification({
      putCode: 1,
      sentDate: 2000,
      source: {
        sourceClientId: { path: 'client-a' } as any,
        sourceName: { content: 'Org A' },
      },
    })
    const perm2 = createPermissionNotification({
      putCode: 2,
      sentDate: 1000,
      source: {
        sourceClientId: { path: 'client-b' } as any,
        sourceName: { content: 'Org B' },
      },
    })

    trustedOrgsSpy.get.and.returnValue(throwError(() => new Error('fail')))
    inboxSpy.getUnreadCount.and.returnValue(of(5))
    inboxSpy.fetchNotificationsIncremental.and.returnValue(
      of({ total: 5, notifications: [perm1, perm2], done: true })
    )

    service.loadUnreadPermissionNotifications(3).subscribe((result) => {
      expect(result.length).toBe(2)
      expect(result[0].source.sourceClientId.path).toBe('client-a')
      expect(result[1].source.sourceClientId.path).toBe('client-b')
      done()
    })
  })

  it('should deduplicate by client (keep first per client)', (done) => {
    const perm1 = createPermissionNotification({
      putCode: 1,
      sentDate: 2000,
      source: {
        sourceClientId: { path: 'client-a' } as any,
        sourceName: { content: 'Org A' },
      },
    })
    const perm2 = createPermissionNotification({
      putCode: 2,
      sentDate: 1500,
      source: {
        sourceClientId: { path: 'client-a' } as any,
        sourceName: { content: 'Org A' },
      },
    })

    inboxSpy.getUnreadCount.and.returnValue(of(5))
    inboxSpy.fetchNotificationsIncremental.and.returnValue(
      of({ total: 5, notifications: [perm1, perm2], done: true })
    )

    service.loadUnreadPermissionNotifications(3).subscribe((result) => {
      expect(result.length).toBe(1)
      expect(result[0].putCode).toBe(1)
      expect(result[0].source.sourceClientId.path).toBe('client-a')
      done()
    })
  })

  it('should filter out read and archived notifications', (done) => {
    const permUnread = createPermissionNotification({
      putCode: 1,
      sentDate: 2000,
      readDate: undefined,
      archivedDate: undefined,
      source: {
        sourceClientId: { path: 'client-a' } as any,
        sourceName: { content: 'Org A' },
      },
    })
    const permRead = createPermissionNotification({
      putCode: 2,
      sentDate: 1500,
      readDate: 9999,
      source: {
        sourceClientId: { path: 'client-b' } as any,
        sourceName: { content: 'Org B' },
      },
    })
    const permArchived = createPermissionNotification({
      putCode: 3,
      sentDate: 1000,
      archivedDate: 9999,
      source: {
        sourceClientId: { path: 'client-c' } as any,
        sourceName: { content: 'Org C' },
      },
    })

    inboxSpy.getUnreadCount.and.returnValue(of(5))
    inboxSpy.fetchNotificationsIncremental.and.returnValue(
      of({
        total: 5,
        notifications: [permUnread, permRead, permArchived],
        done: true,
      })
    )

    service.loadUnreadPermissionNotifications(3).subscribe((result) => {
      expect(result.length).toBe(1)
      expect(result[0].putCode).toBe(1)
      done()
    })
  })

  it('should filter out non-PERMISSION notification types', (done) => {
    const perm = createPermissionNotification({
      putCode: 1,
      source: {
        sourceClientId: { path: 'client-a' } as any,
        sourceName: { content: 'Org A' },
      },
    })
    const otherType = {
      ...createPermissionNotification({ putCode: 2 }),
      notificationType: 'AMENDED',
      source: {
        sourceClientId: { path: 'client-b' } as any,
        sourceName: { content: 'Org B' },
      },
    } as any

    inboxSpy.getUnreadCount.and.returnValue(of(5))
    inboxSpy.fetchNotificationsIncremental.and.returnValue(
      of({ total: 5, notifications: [perm, otherType], done: true })
    )

    service.loadUnreadPermissionNotifications(3).subscribe((result) => {
      expect(result.length).toBe(1)
      expect(result[0].notificationType).toBe('PERMISSION')
      done()
    })
  })

  it('should limit result to maxItems', (done) => {
    const perms = [
      createPermissionNotification({
        putCode: 1,
        sentDate: 3000,
        source: {
          sourceClientId: { path: 'client-a' } as any,
          sourceName: { content: 'A' },
        },
      }),
      createPermissionNotification({
        putCode: 2,
        sentDate: 2000,
        source: {
          sourceClientId: { path: 'client-b' } as any,
          sourceName: { content: 'B' },
        },
      }),
      createPermissionNotification({
        putCode: 3,
        sentDate: 1000,
        source: {
          sourceClientId: { path: 'client-c' } as any,
          sourceName: { content: 'C' },
        },
      }),
    ]

    inboxSpy.getUnreadCount.and.returnValue(of(5))
    inboxSpy.fetchNotificationsIncremental.and.returnValue(
      of({ total: 5, notifications: perms, done: true })
    )

    service.loadUnreadPermissionNotifications(2).subscribe((result) => {
      expect(result.length).toBe(2)
      expect(result[0].source.sourceClientId.path).toBe('client-a')
      expect(result[1].source.sourceClientId.path).toBe('client-b')
      done()
    })
  })

  it('should sort by createdDate descending', (done) => {
    const perm1 = createPermissionNotification({
      putCode: 1,
      createdDate: 1000,
      source: {
        sourceClientId: { path: 'client-a' } as any,
        sourceName: { content: 'A' },
      },
    })
    const perm2 = createPermissionNotification({
      putCode: 2,
      createdDate: 3000,
      source: {
        sourceClientId: { path: 'client-b' } as any,
        sourceName: { content: 'B' },
      },
    })

    inboxSpy.getUnreadCount.and.returnValue(of(5))
    inboxSpy.fetchNotificationsIncremental.and.returnValue(
      of({ total: 5, notifications: [perm1, perm2], done: true })
    )

    service.loadUnreadPermissionNotifications(3).subscribe((result) => {
      expect(result[0].createdDate).toBe(3000)
      expect(result[1].createdDate).toBe(1000)
      done()
    })
  })
})
