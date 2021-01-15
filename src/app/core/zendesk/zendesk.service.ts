import { Inject, Injectable } from '@angular/core'
import { PlatformInfo } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { REDIRECT_URI_REGEXP } from 'src/app/constants'
import { ZendeskWidget } from 'src/app/types'
import { UserSession } from 'src/app/types/session.local'

@Injectable({
  providedIn: 'root',
})
export class ZendeskService {
  zE: ZendeskWidget

  constructor(@Inject(WINDOW) private _window: Window) {}

  hide() {
    this.zE = (<any>this._window).zE
    this.zE('webWidget', 'hide')
  }

  show() {
    this.zE = (<any>this._window).zE
    this.zE('webWidget', 'show')
  }

  open() {
    this.zE('webWidget', 'open')
  }

  adaptPluginToPlatform(platform: PlatformInfo) {
    if (platform.screenDirection === 'rtl') {
      this.zE('webWidget', 'updateSettings', {
        webWidget: {
          position: { horizontal: 'left', vertical: 'bottom' },
        },
      })
    }
  }

  /**
   * Clean the Zendesk widget only allowing the user to fill the default 'ticket form'
   * Will also autofill the user info/subject and description with the error code if those parameters are provided.
   *
   * @param user session to extract the user name
   * @param subject ticket subject
   * @param errorCode error code to add more context for the support staff
   */
  autofillTicketForm(user?: UserSession, subject?: string, errorCode?: string) {
    let uri = '';
    let uriMatch = this._window.location.href.match(REDIRECT_URI_REGEXP);
    if (uriMatch) {
      uri = uriMatch[0]
    }

    this.zE('webWidget', 'updateSettings', {
      webWidget: {
        helpCenter: {
          suppress: true,
        },
        contactForm: {
          /**
           * "Other system" form 
           * https://orcid.zendesk.com/agent/admin/ticket_forms/edit/360003482054
           * If we're planning to autofill tickets for users from different places, 
           * not just the oauth screen, then we should pass the ticket form id as a param
           */ 
          ticketForms: [{ id: 360003482054 }],
          fields: [
            {
              id: 'name',
              prefill: { '*': (user && user.displayName) || '' },
            },
            {
              id: '360028693514', // Orcid input
              prefill: {
                '*':
                  (user &&
                    user.userInfo &&
                    user.userInfo.EFFECTIVE_USER_ORCID) ||
                  '',
              },
            },
            {
              id: 'email',
              prefill: {
                '*':
                  (user && user.userInfo && user.userInfo.PRIMARY_EMAIL) || '',
              },
            },
            { id: 'subject', prefill: { '*': subject || '' } },
            { id: '360039623413', prefill: { '*': uri  || '' } },
            {
              id: 'description',
              prefill: {
                '*':
                  errorCode &&
                  `
_________________
The following is an error code for the support staff, please do not delete or modify it.
Leave your comments above if required.
"${errorCode}"`,
              },
            },
          ],
        },
      },
    })
  }
}
