import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { AccountDefaultEmailFrequenciesService } from 'src/app/core/account-default-email-frequencies/account-default-email-frequencies.service'
import {
  EmailFrequencies,
  EmailFrequenciesValues,
} from 'src/app/types/account-default-visibility.endpoint'

@Component({
  selector: 'app-settings-defaults-email-frequency',
  templateUrl: './settings-defaults-email-frequency.component.html',
  styleUrls: [
    './settings-defaults-email-frequency.component.scss',
    './settings-defaults-email-frequency.component.scss-theme.scss',
  ],
  preserveWhitespaces: true,
})
export class SettingsDefaultsEmailFrequencyComponent
  implements OnInit, OnDestroy
{
  $destroy: Subject<boolean> = new Subject<boolean>()
  isMobile: boolean
  frequencyOption = [
    EmailFrequencies.immediately,
    EmailFrequencies.daily,
    EmailFrequencies.weekly,
    EmailFrequencies.quarterly,
    EmailFrequencies.never,
  ]
  emailFrequenciesValues = EmailFrequenciesValues
  form: UntypedFormGroup
  @Output() loading = new EventEmitter<boolean>()

  constructor(
    private _platform: PlatformInfoService,
    private _fb: UntypedFormBuilder,
    private _emailFrequency: AccountDefaultEmailFrequenciesService
  ) {}

  ngOnInit(): void {
    this.loading.next(true)
    this._emailFrequency.get().subscribe((value) => {
      this.loading.next(false)
      this.form = this._fb.group({
        sendQuarterlyTips: [value.send_quarterly_tips === 'true'],
        sendMemberUpdateRequests: [value.send_member_update_requests],
        sendChangeNotifications: [value.send_change_notifications],
        sendAdministrativeChangeNotifications: [
          value.send_administrative_change_notifications,
        ],
      })

      this.form.controls.sendQuarterlyTips.valueChanges
        .pipe(takeUntil(this.$destroy))
        .subscribe((x) => {
          this.loading.next(true)
          this._emailFrequency
            .updateMemberTipsUpdates(x)
            .subscribe(() => this.loading.next(false))
        })
      this.form.controls.sendMemberUpdateRequests.valueChanges
        .pipe(takeUntil(this.$destroy))
        .subscribe((x) => {
          this.loading.next(true)
          this._emailFrequency
            .updateMemberNotifications(x)
            .subscribe(() => this.loading.next(false))
        })
      this.form.controls.sendChangeNotifications.valueChanges
        .pipe(takeUntil(this.$destroy))
        .subscribe((x) => {
          this.loading.next(true)
          this._emailFrequency
            .updateAmendNotifications(x)
            .subscribe(() => this.loading.next(false))
        })
      this.form.controls.sendAdministrativeChangeNotifications.valueChanges
        .pipe(takeUntil(this.$destroy))
        .subscribe((x) => {
          this.loading.next(true)
          this._emailFrequency
            .updateAdminNotifications(x)
            .subscribe(() => this.loading.next(false))
        })
    })

    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
      })
  }
  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
