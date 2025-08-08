import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms'
import { Subject } from 'rxjs'
import { take, takeUntil } from 'rxjs/operators'
import { VISIBILITY_OPTIONS } from 'src/app/constants'
import { AccountDefaultVisibilityService } from 'src/app/core/account-default-visibility/account-default-visibility.service'
import { RecordService } from 'src/app/core/record/record.service'

@Component({
    selector: 'app-settings-defaults-visibility',
    templateUrl: './settings-defaults-visibility.component.html',
    styleUrls: ['./settings-defaults-visibility.component.scss'],
    preserveWhitespaces: true,
    standalone: false
})
export class SettingsDefaultsVisibilityComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()
  @Output() loading = new EventEmitter<boolean>()
  form: UntypedFormGroup
  visibilityOptions = VISIBILITY_OPTIONS

  constructor(
    private _defaultVisibilityService: AccountDefaultVisibilityService,
    private _record: RecordService,
    private _fb: UntypedFormBuilder
  ) {}

  ngOnInit() {
    this._record
      .getPreferences()
      .pipe(take(1))
      .subscribe((value) => {
        if (value?.default_visibility) {
          this.form = this._fb.group({
            activitiesVisibilityDefault: [value?.default_visibility as string],
          })
        }

        this.form.controls.activitiesVisibilityDefault.valueChanges
          .pipe(takeUntil(this.$destroy))
          .subscribe((activitiesVisibilityDefault) => {
            this.loading.next(true)
            this._defaultVisibilityService
              .update(activitiesVisibilityDefault)
              .subscribe(() => {
                this.loading.next(false)
              })
          })
      })
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
