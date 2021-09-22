import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { AbstractControl, FormGroup } from '@angular/forms'
import { WorkIdType, WorkRelationships } from 'src/app/types/works.endpoint'

@Component({
  selector: 'app-work-external-identifiers-edit',
  templateUrl: './work-external-identifiers-edit.component.html',
  styleUrls: ['./work-external-identifiers-edit.component.scss'],
})
export class WorkExternalIdentifiersEditComponent implements OnInit {
  @Input() externalIdForm: FormGroup
  @Input() index: number
  @Input() workIdTypes: WorkIdType[]
  @Output() cancelEvent = new EventEmitter<void>()
  workRelationships: WorkRelationships[] = Object.keys(
    WorkRelationships
  ) as WorkRelationships[]
  backupValue: any
  constructor() {}

  ngOnInit(): void {
    this.backupValue = this.externalIdForm.value
  }
  cancel() {
    this.externalIdForm.setValue(this.backupValue)
    this.cancelEvent.emit()
  }
}
