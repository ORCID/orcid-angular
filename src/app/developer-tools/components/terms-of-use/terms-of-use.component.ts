import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { MatLegacyCheckbox as MatCheckbox } from '@angular/material/legacy-checkbox'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { DeveloperToolsService } from 'src/app/core/developer-tools/developer-tools.service'
import { RecordService } from 'src/app/core/record/record.service'

@Component({
  selector: 'app-terms-of-use',
  templateUrl: './terms-of-use.component.html',
  styleUrls: [
    './terms-of-use.component.scss',
    './terms-of-use.component.scss-theme.scss',
  ],
  preserveWhitespaces: true,
})
export class TermsOfUseComponent implements OnInit, OnDestroy {
  checked
  dirty: boolean

  @Output() developerToolsEnable = new EventEmitter<boolean>()
  $destroy = new Subject<boolean>()
  emailAlreadyVerified: boolean

  constructor(
    private developerToolsService: DeveloperToolsService,
    private _record: RecordService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}
  ngOnDestroy(): void {
    this.$destroy.next(true)
    this.$destroy.complete()
  }

  ngOnInit(): void {
    this._record
      .getRecord()
      .pipe(takeUntil(this.$destroy))
      .subscribe((userRecord) => {
        const primaryEmail = userRecord?.emails?.emails?.filter(
          (email) => email.primary
        )[0]
        if (primaryEmail?.verified) {
          this.emailAlreadyVerified = true
          this._changeDetectorRef.detectChanges()
        }
      })
  }

  registerForPublicApi() {
    this.dirty = true
    if (!this.checked) {
      return
    }
    this.developerToolsService.enableDeveloperTools().subscribe((res) => {
      this.developerToolsEnable.next(true)
    })
  }
}
