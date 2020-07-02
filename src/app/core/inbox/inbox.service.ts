// TODO @leomendoza123 remove
// tslint:disable: max-line-length
// tslint:disable: quotemark

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
        putCode: 88437,
        notificationType: 'PERMISSION',
        createdDate: 1593565825568,
        sentDate: 1388587532000,
        readDate: 1593565848464,
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
        putCode: 81770,
        notificationType: 'ADMINISTRATIVE',
        createdDate: 1586967301002,
        sentDate: 1586967348702,
        readDate: 1590677984430,
        archivedDate: 1591280102585,
        source: {
          sourceOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-2036-7905',
            path: '0000-0002-2036-7905',
            host: 'qa.orcid.org',
          },
          sourceClientId: null,
          sourceName: { content: 'Leonardo Mendoza' },
          assertionOriginOrcid: null,
          assertionOriginClientId: null,
          assertionOriginName: null,
        },
        sourceDescription: null,
        encryptedPutCode: null,
        subject: "[ORCID] You've been made an Account Delegate!",
        bodyText:
          "Dear Leo Mendoza,\n\nYou have been made an Account Delegate by Leonardo Mendoza with the ORCID iD\nhttps://qa.orcid.org/0000-0002-2036-7905?lang=en. Being made an Account Delegate means\nthat this user has included you in their trusted relationships. As a result you\nmay update and make additions to  Leonardo Mendoza's ORCID Record.\n\n\nFor a tutorial on the functions that you can perform as an Account Delegate please\nview https://support.orcid.org/hc/articles/360006973613.\n\nIf you have questions or concerns about being an Account Delegate, please contact\nLeonardo Mendoza at  leomendoza123@gmail.com, or the ORCID Help Desk\nat https://orcid.org/help/contact-us.\n\nYou have received this email as a service announcement related to your\nORCID Account.\nemail preferences (https://qa.orcid.org/account)\nprivacy policy (https://qa.orcid.org/privacy-policy)\nORCID, Inc.\n10411 Motor City Drive, Suite 750, Bethesda, MD 20817, USA\nhttps://qa.orcid.org\n",
        bodyHtml:
          '<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<title>[ORCID] You\'ve been made an Account Delegate!</title>\n\t</head>\n\t<body>\n\t\t<div style="padding: 20px; padding-top: 0px;">\n\t\t\t<img src="http://orcid.org/sites/all/themes/orcid/img/orcid-logo.png" alt="ORCID.org"/>\n\t\t    <hr />\n\t\t  \t<span style="font-family: arial, helvetica, sans-serif; font-size: 15px; color: #494A4C; font-weight: bold;">\n\t\t\t    Dear Leo Mendoza,\n\t\t    </span>\n\t\t    <p style="font-family: arial, helvetica, sans-serif; font-size: 15px; color: #494A4C;">\n                You have been made an Account Delegate by Leonardo Mendoza with the ORCID iD\n<a href="https://qa.orcid.org/0000-0002-2036-7905?lang=en" target="orcid.blank">https://qa.orcid.org/0000-0002-2036-7905</a>. Being made an Account Delegate means\nthat this user has included you in their trusted relationships. As a result you\nmay update and make additions to Leonardo Mendoza\'s ORCID Record.\n\n\t\t    </p>\n\t\t    <p style="font-family: arial, helvetica, sans-serif; font-size: 15px; color: #494A4C;">\nFor a tutorial on the functions that you can perform as an Account Delegate please\nview https://support.orcid.org/hc/articles/360006973613.\n\t\t    </p>\n\t\t    <p style="font-family: arial, helvetica, sans-serif; font-size: 15px; color: #494A4C;">\n\t\t    \tIf you have questions or concerns about being an Account Delegate, please contact\nLeonardo Mendoza at  leomendoza123@gmail.com, or the ORCID Help Desk\nat <a href="https://orcid.org/help/contact-us">https://orcid.org/help/contact-us</a>.\n\t\t    </p>\t\t    \n\t\t\t<p style="font-family: arial,  helvetica, sans-serif;font-size: 15px;color: #494A4C;">\nYou have received this email as a service announcement related to your\nORCID Account.\n\t\t\t</p>\n\t\t\t<hr />\n\t\t\t<p>\n<small>\n<a href="https://qa.orcid.org/account" target="_blank" style="color: #2E7F9F;">email preferences</a> \n| <a href="https://qa.orcid.org/privacy-policy" target="_blank" style="color: #2E7F9F;">privacy policy</a> \n| ORCID, Inc. | 10411 Motor City Drive, Suite 750, Bethesda, MD 20817, USA \n| <a href="https://qa.orcid.org" target="_blank" style="color: #2E7F9F;">ORCID.org</a>\n</small>\n\t\t\t</p>\n\t\t </div>\n\t </body>\n </html>\n',
        lang: null,
        overwrittenSourceName: null,
      },
      {
        putCode: 81441,
        notificationType: 'INSTITUTIONAL_CONNECTION',
        createdDate: 1585332327160,
        sentDate: 1586967348694,
        readDate: 1591281442750,
        archivedDate: 1585577331222,
        source: {
          sourceOrcid: null,
          sourceClientId: {
            uri: 'https://qa.orcid.org/client/APP-3I3W3WUL4I8QOMBP',
            path: 'APP-3I3W3WUL4I8QOMBP',
            host: 'qa.orcid.org',
          },
          sourceName: { content: 'State University' },
          assertionOriginOrcid: null,
          assertionOriginClientId: null,
          assertionOriginName: null,
        },
        sourceDescription: 'Test client app for institution sign in',
        encryptedPutCode: null,
        authorizationUrl: {
          uri:
            'https://qa.orcid.org/oauth/authorize?response_type=code&client_id=APP-3I3W3WUL4I8QOMBP&scope=%2Fread-limited+%2Factivities%2Fupdate&redirect_uri=https%3A%2F%2Forcid-create-on-demand.herokuapp.com%2Foauth-redirect-idp.php',
          path:
            '/oauth/authorize?response_type=code&client_id=APP-3I3W3WUL4I8QOMBP&scope=%2Fread-limited+%2Factivities%2Fupdate&redirect_uri=https%3A%2F%2Forcid-create-on-demand.herokuapp.com%2Foauth-redirect-idp.php',
          host: 'qa.orcid.org',
        },
        actionedDate: null,
        subject: 'Connecting your institutional account',
        idpName: 'United ID',
        authenticationProviderId: 'https://idp.unitedid.org/idp/shibboleth',
      },
      {
        putCode: 81440,
        notificationType: 'INSTITUTIONAL_CONNECTION',
        createdDate: 1585330323578,
        sentDate: 1585330548056,
        readDate: 1591281443526,
        archivedDate: 1585331188957,
        source: {
          sourceOrcid: null,
          sourceClientId: {
            uri: 'https://qa.orcid.org/client/APP-3I3W3WUL4I8QOMBP',
            path: 'APP-3I3W3WUL4I8QOMBP',
            host: 'qa.orcid.org',
          },
          sourceName: { content: 'State University' },
          assertionOriginOrcid: null,
          assertionOriginClientId: null,
          assertionOriginName: null,
        },
        sourceDescription: 'Test client app for institution sign in',
        encryptedPutCode: null,
        authorizationUrl: {
          uri:
            'https://qa.orcid.org/oauth/authorize?response_type=code&client_id=APP-3I3W3WUL4I8QOMBP&scope=%2Fread-limited+%2Factivities%2Fupdate&redirect_uri=https%3A%2F%2Forcid-create-on-demand.herokuapp.com%2Foauth-redirect-idp.php',
          path:
            '/oauth/authorize?response_type=code&client_id=APP-3I3W3WUL4I8QOMBP&scope=%2Fread-limited+%2Factivities%2Fupdate&redirect_uri=https%3A%2F%2Forcid-create-on-demand.herokuapp.com%2Foauth-redirect-idp.php',
          host: 'qa.orcid.org',
        },
        actionedDate: null,
        subject: 'Connecting your institutional account',
        idpName: 'United ID',
        authenticationProviderId: 'https://idp.unitedid.org/idp/shibboleth',
      },
      {
        putCode: 78749,
        notificationType: 'INSTITUTIONAL_CONNECTION',
        createdDate: 1582153354502,
        sentDate: 1585330548061,
        readDate: 1591280589387,
        archivedDate: 1582153424732,
        source: {
          sourceOrcid: null,
          sourceClientId: {
            uri: 'https://qa.orcid.org/client/APP-3I3W3WUL4I8QOMBP',
            path: 'APP-3I3W3WUL4I8QOMBP',
            host: 'qa.orcid.org',
          },
          sourceName: { content: 'State University' },
          assertionOriginOrcid: null,
          assertionOriginClientId: null,
          assertionOriginName: null,
        },
        sourceDescription: 'Test client app for institution sign in',
        encryptedPutCode: null,
        authorizationUrl: {
          uri:
            'https://qa.orcid.org/oauth/authorize?response_type=code&client_id=APP-3I3W3WUL4I8QOMBP&scope=%2Fread-limited+%2Factivities%2Fupdate&redirect_uri=https%3A%2F%2Forcid-create-on-demand.herokuapp.com%2Foauth-redirect-idp.php',
          path:
            '/oauth/authorize?response_type=code&client_id=APP-3I3W3WUL4I8QOMBP&scope=%2Fread-limited+%2Factivities%2Fupdate&redirect_uri=https%3A%2F%2Forcid-create-on-demand.herokuapp.com%2Foauth-redirect-idp.php',
          host: 'qa.orcid.org',
        },
        actionedDate: null,
        subject: 'Connecting your institutional account',
        idpName: 'United ID',
        authenticationProviderId: 'https://idp.unitedid.org/idp/shibboleth',
      },
      {
        putCode: 78748,
        notificationType: 'INSTITUTIONAL_CONNECTION',
        createdDate: 1582147352239,
        sentDate: 1582147547202,
        readDate: 1582147570436,
        archivedDate: 1582147570356,
        source: {
          sourceOrcid: null,
          sourceClientId: {
            uri: 'https://qa.orcid.org/client/APP-3I3W3WUL4I8QOMBP',
            path: 'APP-3I3W3WUL4I8QOMBP',
            host: 'qa.orcid.org',
          },
          sourceName: { content: 'State University' },
          assertionOriginOrcid: null,
          assertionOriginClientId: null,
          assertionOriginName: null,
        },
        sourceDescription: 'Test client app for institution sign in',
        encryptedPutCode: null,
        authorizationUrl: {
          uri:
            'https://qa.orcid.org/oauth/authorize?response_type=code&client_id=APP-3I3W3WUL4I8QOMBP&scope=%2Fread-limited+%2Factivities%2Fupdate&redirect_uri=https%3A%2F%2Forcid-create-on-demand.herokuapp.com%2Foauth-redirect-idp.php',
          path:
            '/oauth/authorize?response_type=code&client_id=APP-3I3W3WUL4I8QOMBP&scope=%2Fread-limited+%2Factivities%2Fupdate&redirect_uri=https%3A%2F%2Forcid-create-on-demand.herokuapp.com%2Foauth-redirect-idp.php',
          host: 'qa.orcid.org',
        },
        actionedDate: 1582147570436,
        subject: 'Connecting your institutional account',
        idpName: 'United ID',
        authenticationProviderId: 'https://idp.unitedid.org/idp/shibboleth',
      },
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
