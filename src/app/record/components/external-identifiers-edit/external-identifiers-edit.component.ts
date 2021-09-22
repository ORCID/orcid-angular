import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { AbstractControl, FormGroup } from '@angular/forms'
import { WorkIdType, WorkRelationships } from 'src/app/types/works.endpoint'

@Component({
  selector: 'app-external-identifiers-edit',
  templateUrl: './external-identifiers-edit.component.html',
  styleUrls: ['./external-identifiers-edit.component.scss'],
})
export class ExternalIdentifiersEditComponent implements OnInit {
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
