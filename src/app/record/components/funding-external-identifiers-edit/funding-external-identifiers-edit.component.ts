import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { AbstractControl, FormGroup } from '@angular/forms'
import { FundingRelationships } from 'src/app/types/record-funding.endpoint'
import { WorkIdType, WorkRelationships } from 'src/app/types/works.endpoint'

@Component({
  selector: 'app-funding-external-identifiers-edit',
  templateUrl: './funding-external-identifiers-edit.component.html',
  styleUrls: ['./funding-external-identifiers-edit.component.scss'],
})
export class FundingExternalIdentifiersEditComponent implements OnInit {
  @Input() grantForm: FormGroup
  @Input() index: number
  @Output() cancelEvent = new EventEmitter<void>()
  workRelationships: WorkRelationships[] = Object.keys(
    WorkRelationships
  ) as WorkRelationships[]
  backupValue: any

  fundingRelationships: FundingRelationships[] = Object.keys(
    FundingRelationships
  ) as FundingRelationships[]

  
  constructor() {}

  ngOnInit(): void {
    this.backupValue = this.grantForm.value
  }
  cancel() {
    this.grantForm.setValue(this.backupValue)
    this.cancelEvent.emit()
  }
}
