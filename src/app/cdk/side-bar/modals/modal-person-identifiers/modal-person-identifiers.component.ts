import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { MatInput } from '@angular/material/input'
import { cloneDeep } from 'lodash'
import { Subject } from 'rxjs'
import { first, takeUntil } from 'rxjs/operators'
import { ModalComponent } from 'src/app/cdk/modal/modal/modal.component'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { RecordPersonIdentifierService } from 'src/app/core/record-personal-identifiers/record-person-identifier.service'
import { Assertion } from 'src/app/types'
import { VisibilityStrings } from 'src/app/types/common.endpoint'
import { PersonIdentifierEndpoint } from 'src/app/types/record-person-identifier.endpoint'

@Component({
  selector: 'app-modal-person-identifiers',
  templateUrl: './modal-person-identifiers.component.html',
  styleUrls: ['./modal-person-identifiers.component.scss'],
})
export class ModalPersonIdentifiersComponent implements OnInit {
  $destroy: Subject<boolean> = new Subject<boolean>()

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _recordPersonalIdentifiers: RecordPersonIdentifierService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _platform: PlatformInfoService
  ) {}

  addedEmailsCount = 0
  personIdentifiersForm: FormGroup = new FormGroup({})
  personIdentifiers: Assertion[]
  personIdentifiersMap: { [key: string]: Assertion }
  defaultVisibility: VisibilityStrings
  originalPersonalIdentifiers: PersonIdentifierEndpoint
  isMobile: boolean
  loadingPersonalIdentifiers = true

  ngOnInit(): void {
    this._recordPersonalIdentifiers
      .getPersonalIdentifiers()
      .pipe(first())
      .subscribe((personalIds: PersonIdentifierEndpoint) => {
        this.defaultVisibility = personalIds.visibility.visibility
        this.personIdentifiers = cloneDeep(personalIds.externalIdentifiers)
        this.originalPersonalIdentifiers = cloneDeep(personalIds)
        this.backendJsonToForm(personalIds)
        this.loadingPersonalIdentifiers = false
      })

    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (platform) => (this.isMobile = platform.columns4 || platform.columns8)
      )
  }

  backendJsonToForm(emailEndpointJson: PersonIdentifierEndpoint) {
    const personIdentifiers = emailEndpointJson.externalIdentifiers
    const group: { [key: string]: FormGroup } = {}

    personIdentifiers.forEach((personId) => {
      group[personId.putCode] = new FormGroup({
        visibility: new FormControl(personId.visibility.visibility, {}),
      })
    })
    this.personIdentifiersForm = new FormGroup(group)
  }

  formToBackend(personIdentifiersForm: FormGroup): PersonIdentifierEndpoint {
    const personIdentifiers: PersonIdentifierEndpoint = {
      errors: [],
      externalIdentifiers: [],
      visibility: this.originalPersonalIdentifiers.visibility,
    }
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

  getSourceName(address: Assertion) {
    return address.sourceName || address.source
  }

  getDate(address: Assertion) {
    const x = address.createdDate
    let date: Date
    if (x.year && x.month && x.day) {
      date = new Date(
        Date.UTC(
          Number.parseInt(x.year, 10),
          Number.parseInt(x.month, 10),
          Number.parseInt(x.day, 10)
        )
      )
    }

    return date
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
