import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { OrcidValidators } from '../../../../../validators'
import { ILLEGAL_NAME_CHARACTERS_REGEXP, URL_REGEXP } from '../../../../../constants'
import { UserRecord } from '../../../../../types/record.local'
import { RecordNamesService } from '../../../../../core/record-names/record-names.service'
import { RecordOtherNamesService } from '../../../../../core/record-other-names/record-other-names.service'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { Subject } from 'rxjs'
import { PlatformInfoService } from '../../../../../cdk/platform-info'
import { takeUntil } from 'rxjs/operators'
import { Visibility, VisibilityStrings } from '../../../../../types/common.endpoint'
import { Affiliation, Assertion } from '../../../../../types'
import { BiographyEndPoint } from '../../../../../types/record-biography.endpoint'
import { NamesEndPoint } from '../../../../../types/record-name.endpoint'

@Component({
  selector: 'app-modal-name',
  templateUrl: './modal-name.component.html',
  styleUrls: ['./modal-name.component.scss-theme.scss', './modal-name.component.scss']
})
export class ModalNameComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  namesForm: FormGroup
  userRecord: UserRecord
  otherNames: Assertion[]
  isMobile: boolean
  defaultVisibility: VisibilityStrings
  addedOtherNameCount = 0
  loadingNames = true

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserRecord,
    private _recordNameService: RecordNamesService,
    private _recordOtherNamesService: RecordOtherNamesService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _platform: PlatformInfoService
    ) {
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (platform) => (this.isMobile = platform.columns4 || platform.columns8)
      )
  }

  ngOnInit(): void {
    this.userRecord = this.data
    this.otherNames = this.userRecord.otherNames.otherNames
    console.log(JSON.stringify(this.otherNames));
    this.namesForm = new FormGroup({
      givenNames: new FormControl(this.userRecord.names.givenNames.value, {
        validators: [
          Validators.required,
          OrcidValidators.notPattern(ILLEGAL_NAME_CHARACTERS_REGEXP),
          OrcidValidators.notPattern(URL_REGEXP),
        ],
      }),
      familyNames: new FormControl(this.userRecord.names.familyName.value, {
        validators: [
          OrcidValidators.notPattern(URL_REGEXP),
          OrcidValidators.notPattern(ILLEGAL_NAME_CHARACTERS_REGEXP),
        ],
      }),
      publishedName: new FormControl(this.userRecord.person.displayName),
      visibility: new FormControl('', {}),
    })
  }

  onSubmit() {}

  formToBackend(namesForm: FormGroup): any {
    // const visibility = {
    //   errors: [],
    //   required: undefined,
    //   visibility: namesForm.get('visibility').value
    // } as Visibility
    // return {
    //   errors: [],
    //   biography: biographyForm.get('biography').value,
    //   visibility:  visibility,
    // } as NamesEndPoint
  }

  saveEvent() {
    this.loadingNames = true
    this._recordNameService
      .postNames(this.formToBackend(this.namesForm))
      .subscribe((response) => {
        console.log(response)
        this.closeEvent()
      }, error => {
        console.log(error)
      })
  }
  closeEvent() {
    this.dialogRef.close()
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.otherNames, event.previousIndex, event.currentIndex)
  }

  addOtherName() {
      this.namesForm.addControl(
        'new-' + this.addedOtherNameCount,
        new FormGroup({
          country: new FormControl(),
          visibility: new FormControl(this.defaultVisibility, {}),
        })
      )
      this.otherNames.push({
        putCode: 'new-' + this.addedOtherNameCount,
        visibility: { visibility: this.defaultVisibility },
      } as Assertion)
      this.addedOtherNameCount++

      this._changeDetectorRef.detectChanges()
    }

  deleteOtherName(putcode: string) {
    const i = this.otherNames.findIndex((value) => value.putCode === putcode)
    this.otherNames.splice(i, 1)
    this.namesForm.removeControl(putcode)
  }

  getSourceName(names: Assertion) {
    if (names.sourceName) {
      if (names.lastModified) {
        return names.sourceName + ' ' + names.lastModified.year + '-' + names.lastModified.month + '-' + names.lastModified.day
      } else {
        return names.sourceName
      }
    }
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
