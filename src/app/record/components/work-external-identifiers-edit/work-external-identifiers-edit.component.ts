import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core'
import { MatSelect, MatSelectChange } from '@angular/material/select'
import { WorkIdType, WorkRelationships } from 'src/app/types/works.endpoint'

@Component({
  selector: 'app-work-external-identifiers-edit',
  templateUrl: './work-external-identifiers-edit.component.html',
  styleUrls: [
    './work-external-identifiers-edit.component.scss',
    'work-external-identifiers-edit.component.scss-theme.scss',
  ],
})
export class WorkExternalIdentifiersEditComponent
  implements OnInit, AfterViewInit
{
  setLabel = $localize`:@@shared.setRelationShipAriaLabel:Set relationship of `
  asLabel = $localize`:@@shared.asAriaLabel:as`
  @ViewChild('externalIdentifierType') externalIdentifierTypeRef: MatSelect
  @Input() externalIdForm: UntypedFormGroup
  @Input() index: number
  @Input() workIdTypes: WorkIdType[]
  @Output() cancelEvent = new EventEmitter<void>()
  @Output() updateExternalEvent = new EventEmitter<void>()
  workExternalIdErrorMatcher = new WorkExternalIdErrorMatcher()

  cancelAddingExternalIdAriaLabel = $localize`:@@works.cancelAddingAnId:Cancel adding an identifier`

  unResolvedTooltip = $localize`:@@works.unResolved:We couldn't find a resource that matches the identifier you entered.
  Please check the value or enter a valid link to the resource.`

  workRelationships: WorkRelationships[] = Object.keys(
    WorkRelationships
  ) as WorkRelationships[]
  backupValue: any

  ngOrcidSelectIdentifierType = $localize`:@@works.selectAnIdentifier:Select an identifier type`

  constructor(private changeDedectionRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.backupValue = this.externalIdForm?.value
  }

  updateExternal(event: MatSelectChange): void {
    this.updateExternalEvent.emit(event.value)
  }

  ngAfterViewInit() {
    this.externalIdentifierTypeRef?.focus()
    this.changeDedectionRef.detectChanges()
  }

  cancel() {
    this.externalIdForm.setValue(this.backupValue)
    this.cancelEvent.emit()
  }
}

export class WorkExternalIdErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null): boolean {
    return (
      (control.hasError('required') || control.hasError('validFormat')) &&
      control.touched
    )
  }
}
