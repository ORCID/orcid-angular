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
import { MatCheckbox } from '@angular/material/checkbox'
import { MatDialog } from '@angular/material/dialog'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { ModalEmailComponent } from 'src/app/cdk/side-bar/modals/modal-email/modal-email.component'
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
  standalone: false,
})
export class TermsOfUseComponent implements OnInit, OnDestroy {
  checked
  dirty: boolean

  @Output() developerToolsEnable = new EventEmitter<boolean>()
  $destroy = new Subject<boolean>()
  emailAlreadyVerified: boolean
  hasVerifiedEmailAddress: boolean

  constructor(
    private developerToolsService: DeveloperToolsService,
    private _record: RecordService,
    private _dialog: MatDialog,
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
        this.hasVerifiedEmailAddress = userRecord.emails.emails.some(
          (email) => email.verified
        )
        if (primaryEmail?.verified) {
          this.emailAlreadyVerified = true
          this._changeDetectorRef.detectChanges()
        }
      })
  }

  openEmailModal() {
    return this._dialog
      .open(ModalEmailComponent, {
        width: '850px',
        maxWidth: '99%',
        // data: this.userRecord,
        // ariaLabel: getAriaLabel(this.editModalComponent, this.type),
      })
      .afterClosed()
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
