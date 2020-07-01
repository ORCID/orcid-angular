// TODO @leomendoza123 remove
// tslint:disable: max-line-length

import { Injectable, LOCALE_ID, Inject } from '@angular/core'
import { of } from 'rxjs'
import {
  InboxNotification,
  InboxNotificationAmended,
  InboxNotificationHtml,
  InboxNotificationInstitutional,
  InboxNotificationPermission,
} from '../../types/notifications.endpoint'

@Injectable({
  providedIn: 'root',
})
export class InboxService {
  constructor() {}

  getNotifications(value = 0) {
    // MOCK NOTIFICATIONS
    return of<
      (
        | InboxNotificationAmended
        | InboxNotificationHtml
        | InboxNotificationInstitutional
        | InboxNotificationPermission
      )[]
    >([
      {
        putCode: 88439,
        notificationType: 'PERMISSION',
        createdDate: 1593566837949,
        sentDate: 1388587532000,
        readDate: 1593566843132,
        archivedDate: null,
        source: {
          sourceOrcid: null,
          sourceClientId: {
            uri: 'https://qa.orcid.org/client/APP-4U6ZU6Q1MK3XTY3W',
            path: 'APP-4U6ZU6Q1MK3XTY3W',
            host: 'qa.orcid.org',
          },
          sourceName: { content: 'ORCID Test' },
          assertionOriginOrcid: null,
          assertionOriginClientId: null,
          assertionOriginName: null,
        },
        sourceDescription: 'description descrption',
        encryptedPutCode: null,
        authorizationUrl: {
          uri:
            'https://orcid.org/oauth/authorize?client_id=APP-U4UKCNSSIM1OCVQY&response_type=code&scope=/orcid-works/create&redirect_uri=http://somethirdparty.com',
          path:
            '/oauth/authorize?client_id=APP-U4UKCNSSIM1OCVQY&response_type=code&scope=/orcid-works/create&redirect_uri=http://somethirdparty.com',
          host: 'qa.orcid.org',
        },
        items: {
          items: [
            {
              putCode: null,
              itemType: 'EDUCATION',
              itemName: 'LOL',
              externalIdentifier: null,
              actionType: null,
              additionalInfo: {},
            },
            {
              putCode: null,
              itemType: 'WORK',
              itemName: 'A Really Interesting Research Article',
              externalIdentifier: {
                type: 'DOI',
                value: 'http://10.5555/12345ABCDE',
                normalized: null,
                normalizedError: null,
                url: null,
                relationship: null,
              },
              actionType: null,
              additionalInfo: {},
            },
            {
              putCode: null,
              itemType: 'EMPLOYMENT',
              itemName: 'Head of Research at NanoBiologica',
              externalIdentifier: null,
              actionType: null,
              additionalInfo: {},
            },
          ],
        },
        actionedDate: null,
        subject: 'Subject',
        notificationSubject: 'Subject',
        notificationIntro: 'Intro',
      },
      {
        putCode: 88438,
        notificationType: 'PERMISSION',
        createdDate: 1593566761896,
        sentDate: 1388587532000,
        readDate: 1593566770136,
        archivedDate: null,
        source: {
          sourceOrcid: null,
          sourceClientId: {
            uri: 'https://qa.orcid.org/client/APP-4U6ZU6Q1MK3XTY3W',
            path: 'APP-4U6ZU6Q1MK3XTY3W',
            host: 'qa.orcid.org',
          },
          sourceName: { content: 'ORCID Test' },
          assertionOriginOrcid: null,
          assertionOriginClientId: null,
          assertionOriginName: null,
        },
        sourceDescription: 'description descrption',
        encryptedPutCode: null,
        authorizationUrl: {
          uri:
            'https://orcid.org/oauth/authorize?client_id=APP-U4UKCNSSIM1OCVQY&response_type=code&scope=/orcid-works/create&redirect_uri=http://somethirdparty.com',
          path:
            '/oauth/authorize?client_id=APP-U4UKCNSSIM1OCVQY&response_type=code&scope=/orcid-works/create&redirect_uri=http://somethirdparty.com',
          host: 'qa.orcid.org',
        },
        items: {
          items: [
            {
              putCode: null,
              itemType: 'PEER_REVIEW',
              itemName: 'LOL',
              externalIdentifier: null,
              actionType: null,
              additionalInfo: {},
            },
            {
              putCode: null,
              itemType: 'WORK',
              itemName: 'A Really Interesting Research Article',
              externalIdentifier: {
                type: 'DOI',
                value: 'http://10.5555/12345ABCDE',
                normalized: null,
                normalizedError: null,
                url: null,
                relationship: null,
              },
              actionType: null,
              additionalInfo: {},
            },
            {
              putCode: null,
              itemType: 'EMPLOYMENT',
              itemName: 'Head of Research at NanoBiologica',
              externalIdentifier: null,
              actionType: null,
              additionalInfo: {},
            },
          ],
        },
        actionedDate: null,
        subject: 'Subject',
        notificationSubject: 'Subject',
        notificationIntro: 'Intro',
      },
      {
        putCode: 88235,
        notificationType: 'AMENDED',
        createdDate: 1592956882383,
        sentDate: null,
        readDate: 1592957178591,
        archivedDate: null,
        source: {
          sourceOrcid: null,
          sourceClientId: {
            uri: 'https://qa.orcid.org/client/APP-T7ILANOMQ2QB4DEI',
            path: 'APP-T7ILANOMQ2QB4DEI',
            host: 'qa.orcid.org',
          },
          sourceName: { content: "Leo's App" },
          assertionOriginOrcid: null,
          assertionOriginClientId: null,
          assertionOriginName: null,
        },
        sourceDescription: 'Testing app ',
        encryptedPutCode: null,
        amendedSection: 'EMPLOYMENT',
        items: {
          items: [
            {
              putCode: null,
              itemType: 'EMPLOYMENT',
              itemName: 'role-title',
              externalIdentifier: null,
              actionType: 'CREATE',
              additionalInfo: {
                department: 'department-name',
                org_name: 'common:name',
              },
            },
          ],
        },
        subject: 'Your ORCID Record was amended',
      },
      {
        putCode: 88234,
        notificationType: 'AMENDED',
        createdDate: 1592956873666,
        sentDate: null,
        readDate: 1592957184095,
        archivedDate: null,
        source: {
          sourceOrcid: null,
          sourceClientId: {
            uri: 'https://qa.orcid.org/client/APP-T7ILANOMQ2QB4DEI',
            path: 'APP-T7ILANOMQ2QB4DEI',
            host: 'qa.orcid.org',
          },
          sourceName: { content: "Leo's App" },
          assertionOriginOrcid: null,
          assertionOriginClientId: null,
          assertionOriginName: null,
        },
        sourceDescription: 'Testing app ',
        encryptedPutCode: null,
        amendedSection: 'EMPLOYMENT',
        items: {
          items: [
            {
              putCode: null,
              itemType: 'EMPLOYMENT',
              itemName: 'role-title',
              externalIdentifier: null,
              actionType: 'CREATE',
              additionalInfo: {
                department: 'department-name',
                org_name: 'common:name',
              },
            },
          ],
        },
        subject: 'Your ORCID Record was amended',
      },
      {
        putCode: 88233,
        notificationType: 'AMENDED',
        createdDate: 1592956796872,
        sentDate: null,
        readDate: 1592957185435,
        archivedDate: null,
        source: {
          sourceOrcid: null,
          sourceClientId: {
            uri: 'https://qa.orcid.org/client/APP-T7ILANOMQ2QB4DEI',
            path: 'APP-T7ILANOMQ2QB4DEI',
            host: 'qa.orcid.org',
          },
          sourceName: { content: "Leo's App" },
          assertionOriginOrcid: null,
          assertionOriginClientId: null,
          assertionOriginName: null,
        },
        sourceDescription: 'Testing app ',
        encryptedPutCode: null,
        amendedSection: 'PEER_REVIEW',
        items: {
          items: [
            {
              putCode: null,
              itemType: 'PEER_REVIEW',
              itemName: 'Learned publishing.',
              externalIdentifier: null,
              actionType: 'CREATE',
              additionalInfo: {
                subject_container_name: 'Journal title',
                group_name: 'Learned publishing.',
              },
            },
          ],
        },
        subject: 'Your ORCID Record was amended',
      },
      {
        putCode: 88232,
        notificationType: 'AMENDED',
        createdDate: 1592956448686,
        sentDate: null,
        readDate: 1592956472477,
        archivedDate: null,
        source: {
          sourceOrcid: null,
          sourceClientId: {
            uri: 'https://qa.orcid.org/client/APP-T7ILANOMQ2QB4DEI',
            path: 'APP-T7ILANOMQ2QB4DEI',
            host: 'qa.orcid.org',
          },
          sourceName: { content: "Leo's App" },
          assertionOriginOrcid: null,
          assertionOriginClientId: null,
          assertionOriginName: null,
        },
        sourceDescription: 'Testing app ',
        encryptedPutCode: null,
        amendedSection: 'EMPLOYMENT',
        items: {
          items: [
            {
              putCode: null,
              itemType: 'EMPLOYMENT',
              itemName: 'role-title',
              externalIdentifier: null,
              actionType: 'CREATE',
              additionalInfo: {
                department: 'department-name',
                org_name: 'common:name',
              },
            },
          ],
        },
        subject: 'Your ORCID Record was amended',
      },
    ])
  }
}
