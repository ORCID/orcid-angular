import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core'
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { cloneDeep } from 'lodash'
import { Subject } from 'rxjs'
import { first, takeUntil } from 'rxjs/operators'
import { ModalComponent } from 'src/app/cdk/modal/modal/modal.component'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { RecordPersonIdentifierService } from 'src/app/core/record-personal-identifiers/record-person-identifier.service'
import { Assertion } from 'src/app/types'
import { PersonIdentifierEndpoint } from 'src/app/types/record-person-identifier.endpoint'

@Component({
  selector: 'app-modal-person-identifiers',
  templateUrl: './modal-person-identifiers.component.html',
  styleUrls: ['./modal-person-identifiers.component.scss'],
  preserveWhitespaces: true,
})
export class ModalPersonIdentifiersComponent implements OnInit, OnDestroy {
  ariaLabelSave = $localize`:@@side-bar.ariaLabelPersonalIdSave:Save changes to Other identifiers`
  ariaLabelCancel = $localize`:@@side-bar.ariaLabelPersonalIdCancel:Cancel changes and close Other identifiers`
  ariaLabelClose = $localize`:@@side-bar.ariaLabelPersonalIdClose:Close Other identifiers`
  ariaLabelDelete = $localize`:@@share.ariaLabelDelete:Delete identifier`
  ariaLabelIdentifier = $localize`:@@share.ariaLabelIdentifier:Identifier`
  ariaLabelOtherIdsSupport = $localize`:@@side-bar.ariaLabelOtherIdsSupport:Find out how to add other identifiers to your ORCID record (Opens in a new tab)`
  ariaLabelIdentifierUrl = $localize`:@@side-bar.ariaLabelUrl:(Opens in a new tab)`
  $destroy: Subject<boolean> = new Subject<boolean>()

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _recordPersonalIdentifiers: RecordPersonIdentifierService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _platform: PlatformInfoService
  ) {}

  personIdentifiersForm: UntypedFormGroup = new UntypedFormGroup({})
  personIdentifiers: Assertion[]
  originalPersonalIdentifiers: PersonIdentifierEndpoint
  isMobile: boolean
  screenDirection = 'ltr'
  loadingPersonalIdentifiers = true

  ngOnInit(): void {
    this._recordPersonalIdentifiers
      .getPersonalIdentifiers()
      .pipe(first())
      .subscribe((personalIds: PersonIdentifierEndpoint) => {
        this.personIdentifiers = cloneDeep(personalIds.externalIdentifiers)
        this.originalPersonalIdentifiers = cloneDeep(personalIds)
        this.backendJsonToForm(personalIds)
        this.loadingPersonalIdentifiers = false
      })

    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
        this.screenDirection = platform.screenDirection
      })
  }

  backendJsonToForm(emailEndpointJson: PersonIdentifierEndpoint) {
    const personIdentifiers = emailEndpointJson.externalIdentifiers
    const group: { [key: string]: UntypedFormGroup } = {}

    personIdentifiers.forEach((personId) => {
      group[personId.putCode] = new UntypedFormGroup({
        visibility: new UntypedFormControl(personId.visibility.visibility, {}),
      })
    })
    this.personIdentifiersForm = new UntypedFormGroup(group)
  }

  formToBackend(
    personIdentifiersForm: UntypedFormGroup
  ): PersonIdentifierEndpoint {
    const personIdentifiers: PersonIdentifierEndpoint = {
      errors: [],
      externalIdentifiers: [],
      visibility: this.originalPersonalIdentifiers.visibility,
    }
    this._changeDetectorRef.detach()
    this.personIdentifiers.reverse()
    this.personIdentifiers
      .map((value) => value.putCode)
      // Clear empty inputs
      .forEach((key, i) => {
        const visibility = personIdentifiersForm.value[key].visibility
        if (personIdentifiersForm.value[key]) {
          personIdentifiers.externalIdentifiers.push({
            putCode: key.indexOf('new-') === 0 ? null : key,
            displayIndex: i + 1,
            visibility: {
              visibility,
            },
          } as Assertion)
        }
      })
    return personIdentifiers
  }

  saveEvent() {
    this.loadingPersonalIdentifiers = true
    this._recordPersonalIdentifiers
      .postPersonalIdentifiers(this.formToBackend(this.personIdentifiersForm))
      .subscribe((response) => {
        this.closeEvent()
      })
  }
  closeEvent() {
    this.dialogRef.close()
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.personIdentifiers,
      event.previousIndex,
      event.currentIndex
    )
  }

  deletePersonalIdentifier(putCode: string): void {
    const i = this.personIdentifiers.findIndex(
      (value) => value.putCode === putCode
    )
    this.personIdentifiers.splice(i, 1)
    this.personIdentifiersForm.removeControl(putCode)
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
