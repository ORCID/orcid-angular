import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { UntypedFormGroup } from '@angular/forms'
import { FundingRelationships } from 'src/app/types/record-funding.endpoint'
import { WorkRelationships } from 'src/app/types/works.endpoint'

@Component({
  selector: 'app-funding-external-identifiers-edit',
  templateUrl: './funding-external-identifiers-edit.component.html',
  styleUrls: [
    './funding-external-identifiers-edit.component.scss',
    './funding-external-identifiers-edit.component.scss-theme.scss',
  ],
})
export class FundingExternalIdentifiersEditComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('grantNumber') grantNumberRef: ElementRef
  @Input() grantForm: UntypedFormGroup
  @Input() index: number
  @Output() cancelEvent = new EventEmitter<void>()
  workRelationships: WorkRelationships[] = Object.keys(
    WorkRelationships
  ) as WorkRelationships[]
  backupValue: any

  fundingRelationships: FundingRelationships[] = Object.keys(
    FundingRelationships
  ) as FundingRelationships[]

  constructor(private changeDedectionRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.backupValue = this.grantForm?.value
  }
  ngAfterViewInit() {
    this.grantNumberRef.nativeElement.focus()
    this.changeDedectionRef.detectChanges()
  }

  cancel() {
    this.grantForm.setValue(this.backupValue)
    this.cancelEvent.emit()
  }
}
