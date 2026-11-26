import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import {
  AccountTrustedIndividualsService,
  DelegateInvitationSearchRequest,
  DelegateInvitationSearchResult,
} from 'src/app/core/account-trusted-individuals/account-trusted-individuals.service'

@Component({
  selector: 'app-settings-trusted-individuals-search',
  templateUrl: './settings-trusted-individuals-search.component.html',
  styleUrls: [
    './settings-trusted-individuals-search.component.scss',
    './settings-trusted-individuals-search.component.scss-theme.scss',
  ],
  standalone: false,
})
export class SettingsTrustedIndividualsSearchComponent
  implements OnInit, OnDestroy
{
  @Output() invitationSent = new EventEmitter<void>()
  private destroy = new Subject<void>()
  isMobile: boolean
  searchValue = ''
  loading = false
  error = ''
  errorValue = ''
  success = false
  sentTo = ''
  result: DelegateInvitationSearchResult | null = null
  request: DelegateInvitationSearchRequest | null = null

  constructor(
    private account: AccountTrustedIndividualsService,
    private platform: PlatformInfoService
  ) {}

  ngOnInit(): void {
    this.platform
      .get()
      .pipe(takeUntil(this.destroy))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
      })
  }

  inputChanged(): void {
    this.result = null
    this.request = null
    this.error = ''
    this.errorValue = ''
    this.success = false
  }

  search(value: string): void {
    if (this.loading) return
    this.inputChanged()
    const input = (value || '').trim()
    let request: DelegateInvitationSearchRequest
    if (input.includes('@')) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
        this.error = $localize`:@@account.invitationInvalidEmail:Enter a valid email address.`
        return
      }
      request = { lookupType: 'EMAIL', value: input }
    } else {
      const orcid = input.toUpperCase()
      if (!this.validOrcid(orcid)) {
        this.error = $localize`:@@account.invitationInvalidOrcid:Enter a valid ORCID iD or email address.`
        return
      }
      request = { lookupType: 'ORCID', value: orcid }
    }
    this.loading = true
    this.account
      .searchInvitation(request)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (result) => {
          this.loading = false
          if (result.status === 'FOUND') {
            this.request = request
            this.result = result
          } else {
            this.error = this.statusMessage(result.status)
            this.errorValue = this.valueFor(result.status, request.value)
          }
        },
        error: () => {
          this.loading = false
          this.error = this.statusMessage('ERROR')
        },
      })
  }

  send(): void {
    if (!this.request || this.loading) return
    this.loading = true
    this.error = ''
    this.account
      .sendInvitation(this.request)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (response) => {
          this.loading = false
          if (response.status === 'SENT') {
            this.sentTo = this.request.value
            this.result = null
            this.request = null
            this.success = true
            this.invitationSent.emit()
          } else {
            this.errorValue = this.valueFor(response.status, this.request.value)
            this.result = null
            this.request = null
            this.error = this.statusMessage(response.status)
          }
        },
        error: () => {
          this.loading = false
          this.error = this.statusMessage('ERROR')
        },
      })
  }

  private validOrcid(value: string): boolean {
    if (!/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(value)) return false
    const digits = value.replace(/-/g, '')
    let total = 0
    for (const digit of digits.slice(0, 15)) total = (total + Number(digit)) * 2
    const check = (12 - (total % 11)) % 11
    return digits[15] === (check === 10 ? 'X' : String(check))
  }

  private valueFor(status: string, value: string): string {
    return status === 'ACTIVE_INVITATION' || status === 'ALREADY_DELEGATE'
      ? value
      : ''
  }

  private statusMessage(status: string): string {
    switch (status) {
      case 'INVALID':
        return $localize`:@@account.invitationInvalid:Enter a valid ORCID iD or email address.`
      case 'NOT_FOUND':
        return $localize`:@@account.invitationNotFound:No matching ORCID record was found.`
      case 'SELF':
        return $localize`:@@account.invitationSelf:You cannot invite yourself.`
      case 'ACTIVE_INVITATION':
        return $localize`:@@account.invitationPending:An invitation is already pending for`
      case 'ALREADY_DELEGATE':
        return $localize`:@@account.invitationAlreadyDelegate:An account delegate already exists for`
      default:
        return $localize`:@@account.invitationError:Something went wrong. Please try again.`
    }
  }

  ngOnDestroy(): void {
    this.destroy.next()
    this.destroy.complete()
  }
}
