import { convertToParamMap } from '@angular/router'
import { of, Subject, throwError } from 'rxjs'
import { DelegateInvitationActionService } from '../core/delegate-invitation-action/delegate-invitation-action.service'
import { DelegateInvitationComponent } from './delegate-invitation.component'

describe('DelegateInvitationComponent', () => {
  const token = '7e7d2ab1-0cf9-4c65-99ed-1809af5d5e75'
  let router: any
  let http: any
  let user: any
  let actions: DelegateInvitationActionService
  let storage: Storage

  beforeEach(() => {
    storage = window.sessionStorage
    actions = new DelegateInvitationActionService(window)
    actions.clear()
    router = jasmine.createSpyObj('Router', ['navigate'])
    http = jasmine.createSpyObj('HttpClient', ['post'])
    user = jasmine.createSpyObj('UserService', ['getUserSession'])
  })

  afterEach(() => actions.clear())

  function component(params: Record<string, string>) {
    return new DelegateInvitationComponent(
      { snapshot: { queryParamMap: convertToParamMap(params) } } as any,
      router,
      user,
      actions,
      http
    )
  }

  it('saves a valid action and redirects an anonymous user to sign-in without a POST', () => {
    user.getUserSession.and.returnValue(of({ loggedIn: false }))
    component({ token, decision: 'ACCEPT' }).ngOnInit()

    expect(actions.get()).toEqual({ token, decision: 'ACCEPT' })
    expect(router.navigate).toHaveBeenCalledWith(['/signin'], {
      replaceUrl: true,
    })
    expect(http.post).not.toHaveBeenCalled()
  })

  it('posts the chosen response only after the session is known and goes to trusted parties', () => {
    const session = new Subject<any>()
    user.getUserSession.and.returnValue(session)
    http.post.and.returnValue(of({ status: 'DECLINED' }))
    component({ token, decision: 'DECLINE' }).ngOnInit()
    expect(http.post).not.toHaveBeenCalled()
    session.next({ loggedIn: true })

    expect(http.post).toHaveBeenCalledWith(
      runtimeEnvironment.API_WEB + 'account/delegate-invitations/respond.json',
      {
        invitationToken: token,
        decision: 'DECLINE',
      }
    )
    expect(router.navigate).toHaveBeenCalledWith(['/trusted-parties'], {
      queryParams: { invitationResponse: 'DECLINED' },
      replaceUrl: true,
    })
    expect(storage.getItem('delegateInvitationAction')).toBeNull()
  })

  it('rejects malformed or unrecognized actions before making a request', () => {
    component({ token: 'invalid', decision: 'ACCEPT' }).ngOnInit()
    expect(user.getUserSession).not.toHaveBeenCalled()
    expect(http.post).not.toHaveBeenCalled()
    expect(router.navigate).toHaveBeenCalledWith(['/trusted-parties'], {
      queryParams: { invitationResponse: 'INVALID' },
      replaceUrl: true,
    })
  })

  it('does not silently treat an HTTP failure as an accepted invitation', () => {
    user.getUserSession.and.returnValue(of({ loggedIn: true }))
    http.post.and.returnValue(throwError(() => new Error('unavailable')))
    component({ token, decision: 'ACCEPT' }).ngOnInit()
    expect(router.navigate).toHaveBeenCalledWith(['/trusted-parties'], {
      queryParams: { invitationResponse: 'ERROR' },
      replaceUrl: true,
    })
  })
})
