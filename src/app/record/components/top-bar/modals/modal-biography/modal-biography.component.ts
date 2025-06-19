import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms'
import { UserRecord } from '../../../../../types/record.local'
import { RecordBiographyService } from '../../../../../core/record-biography/record-biography.service'
import { BiographyEndPoint } from '../../../../../types/record-biography.endpoint'
import {
  Visibility,
  VisibilityStrings,
} from '../../../../../types/common.endpoint'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import {
  PlatformInfo,
  PlatformInfoService,
} from '../../../../../cdk/platform-info'
import { WINDOW } from '../../../../../cdk/window'

@Component({
  selector: 'app-modal-biography',
  templateUrl: './modal-biography.component.html',
  styleUrls: [
    './modal-biography.component.scss-theme.scss',
    './modal-biography.component.scss',
  ],
})
export class ModalBiographyComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  biographyForm: UntypedFormGroup
  userRecord: UserRecord
  biography = ''
  biographyVisibility: VisibilityStrings = 'PRIVATE'
  loadingBiography = true
  defaultVisibility: VisibilityStrings
  platform: PlatformInfo

  ngOrcidAddYourBiography = $localize`:@@topBar.addBiography:Add your biography`
  ngOrcidDefaultVisibilityLabel = $localize`:@@shared.whoCanSeeBio:Control who can see your biography by setting the visibility. Your default visibility setting is`
  closeAriaLabel = $localize`:@@topBar.ariaLabelCloseBiography:Close Biography`
  saveAriaLabel = $localize`:@@topBar.ariaLabelSaveChangesBiography:Save changes to Biography`
  cancelAriaLabel = $localize`:@@topBar.ariaLabelCancelChangesBiography:Cancel changes close Biography`
  visibilityPublicAriaLabel = $localize`:@@topBar.ariaLabelBiographyPublic:Set biography visibility to Everyone`
  visibilityTrustedPartyAriaLabel = $localize`:@@topBar.ariaLabelBiographyTrustedParty:Set biography visibility to Trusted Parties`
  visibilityPrivateAriaLabel = $localize`:@@topBar.ariaLabelBiographyPrivate:Set biography visibility to Only Me`
  ariaLabelBiography = $localize`:@@topBar.biography:Biography`

  constructor(
    @Inject(WINDOW) private window: Window,
    private _platform: PlatformInfoService,
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserRecord,
    private _cdref: ChangeDetectorRef,
    private _recordBiographyService: RecordBiographyService
  ) {
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.platform = platform
      })
  }

  ngOnInit(): void {
    this.loadingBiography = false
    this.userRecord = this.data
    this.defaultVisibility = this.userRecord?.preferences?.default_visibility
    this.biographyVisibility = this.defaultVisibility
    if (this.userRecord?.biography?.biography) {
      this.biography = this.userRecord.biography.biography.value
      this.biographyVisibility = this.userRecord.biography.visibility.visibility
    }
    this.biographyForm = new UntypedFormGroup({
      biography: new UntypedFormControl(this.biography),
      visibility: new UntypedFormControl(this.biographyVisibility),
    })
  }

  onSubmit() {}

  formToBackend(biographyForm: UntypedFormGroup): BiographyEndPoint {
    const visibility = {
      errors: [],
      required: undefined,
      visibility: biographyForm.get('visibility').value,
    } as Visibility
    return {
      errors: [],
      biography: biographyForm.get('biography').value,
      visibility: visibility,
    } as BiographyEndPoint
  }

  saveEvent() {
    this.loadingBiography = true
    this._recordBiographyService
      .postBiography(this.formToBackend(this.biographyForm))
      .subscribe(
        (response) => {
          this.closeEvent()
        },
        (error) => {}
      )
  }

  closeEvent() {
    this.dialogRef.close()
  }

  toBiography() {
    this.window.document.getElementById('biography').scrollIntoView()
  }

  toVisibility() {
    this.window.document.getElementById('visibility').scrollIntoView()
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
