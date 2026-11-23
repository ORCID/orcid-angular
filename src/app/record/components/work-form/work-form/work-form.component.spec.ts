import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WorkFormComponent } from './work-form.component'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../../cdk/window'
import { PlatformInfoService } from '../../../../cdk/platform-info'
import { RecordWorksService } from '../../../../core/record-works/record-works.service'
import { SnackbarService } from '../../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { RecordService } from '../../../../core/record/record.service'
import { RecordCountriesService } from '../../../../core/record-countries/record-countries.service'
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
} from '@angular/forms'
import { SharedModule } from '../../../../shared/shared.module'
import { getWork } from '../../../../core/record-works/record-works.service.spec'
import { getContributor } from '../../work-contributors/work-contributors.component.spec'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'
import { RecordModule } from '../../../record.module'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { of, Subject } from 'rxjs'
import { WorkExternalIdentifiersEditComponent } from '../../work-external-identifiers-edit/work-external-identifiers-edit.component'

describe('WorkFormComponent', () => {
  let component: WorkFormComponent
  let fixture: ComponentFixture<WorkFormComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        RecordModule,
        RouterTestingModule,
        SharedModule,
      ],
      declarations: [WorkFormComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        WINDOW_PROVIDERS,
        UntypedFormBuilder,
        PlatformInfoService,
        RecordService,
        RecordWorksService,
        RecordCountriesService,
        SnackbarService,
        MatSnackBar,
        Overlay,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('does not revalidate imported identifiers until their type or value changes', () => {
    component.externalIdentifier = true
    const validate = spyOn(
      TestBed.inject(RecordWorksService),
      'validateWorkIdTypes'
    ).and.returnValue(
      of({ validFormat: true, attemptedResolution: false } as any)
    )
    component.addOtherWorkId({
      externalIdentifierType: { value: 'pmc' },
      externalIdentifierId: { value: 'PMC11195135' },
    } as any)
    component.addOtherWorkId({
      externalIdentifierType: { value: 'doi' },
      externalIdentifierId: { value: '10.1101/2024.06.10.597395' },
    } as any)
    const group = component.workIdentifiersFormArray.at(0)
    expect(validate).not.toHaveBeenCalled()
    expect(group.pending).toBeFalse()
    expect(component.workIdentifiersFormArray.pending).toBeFalse()

    group.get('externalIdentifierId').setValue('PMC123')
    expect(validate).toHaveBeenCalledOnceWith('pmc', 'PMC123')
    group.get('externalIdentifierType').setValue('pmid')
    expect(validate).toHaveBeenCalledWith('pmid', 'PMC123')
  })

  it('does not restart identifier validation when a URL is edited', () => {
    const responses = new Subject<any>()
    const validate = spyOn(
      TestBed.inject(RecordWorksService),
      'validateWorkIdTypes'
    ).and.returnValue(responses)
    component.addOtherWorkId()
    const group = component.workIdentifiersFormArray.at(0)
    group.get('externalIdentifierType').setValue('doi')
    group.get('externalIdentifierId').setValue('10.1000/example')
    const calls = validate.calls.count()
    group.get('externalIdentifierUrl').setValue('https://example.org/article')
    expect(validate.calls.count()).toBe(calls)
    responses.next({ validFormat: true, attemptedResolution: false })
    responses.complete()
    expect(group.pending).toBeFalse()
  })

  it('clears only the changed identifier URL and allows a newly resolved URL', () => {
    const response = new Subject<any>()
    spyOn(
      TestBed.inject(RecordWorksService),
      'validateWorkIdTypes'
    ).and.returnValue(response)
    component.externalIdentifier = true
    component.addOtherWorkId({
      externalIdentifierType: { value: 'pmc' },
      externalIdentifierId: { value: 'PMC11195135' },
      url: { value: 'https://example.org/old' },
    } as any)
    component.addOtherWorkId({
      externalIdentifierType: { value: 'pmc' },
      externalIdentifierId: { value: 'PMC12345678' },
      url: { value: 'https://example.org/other' },
    } as any)
    const group = component.workIdentifiersFormArray.at(0)
    const other = component.workIdentifiersFormArray.at(1)
    group.get('externalIdentifierId').updateValueAndValidity()
    expect(group.get('externalIdentifierUrl').value).toBe(
      'https://example.org/old'
    )

    group.get('externalIdentifierId').setValue('PMC87654321')
    expect(group.get('externalIdentifierUrl').value).toBe('')
    expect(other.get('externalIdentifierUrl').value).toBe(
      'https://example.org/other'
    )
    response.next({
      validFormat: true,
      attemptedResolution: true,
      resolved: true,
      generatedUrl: 'https://example.org/new',
    })
    response.complete()
    expect(group.get('externalIdentifierUrl').value).toBe(
      'https://example.org/new'
    )
  })

  it('does not report a validation error while a manually entered PMC is being checked', () => {
    const response = new Subject<any>()
    spyOn(
      TestBed.inject(RecordWorksService),
      'validateWorkIdTypes'
    ).and.returnValue(response)
    const snackbar = spyOn(
      TestBed.inject(SnackbarService),
      'showValidationError'
    )
    component.addOtherWorkId()
    const group = component.workIdentifiersFormArray.at(0)
    group.get('externalIdentifierType').setValue('pmc')
    group.get('externalIdentifierId').setValue('PMC11195135')

    const editor = TestBed.createComponent(WorkExternalIdentifiersEditComponent)
    editor.componentInstance.externalIdForm = group as any
    editor.detectChanges()
    expect(
      editor.nativeElement.querySelector('[role="status"]')?.textContent
    ).toContain('Checking identifier')
    expect(editor.nativeElement.querySelector('mat-progress-bar')).not.toBeNull()
    expect(component.workForm.pending).toBeTrue()
    component.saveEvent()
    expect(snackbar).not.toHaveBeenCalled()
    response.next({
      validFormat: true,
      attemptedResolution: true,
      resolved: true,
    })
    response.complete()
    expect(component.workForm.pending).toBeFalse()
    editor.detectChanges()
    expect(editor.nativeElement.querySelector('[role="status"]')).toBeNull()
    expect(editor.nativeElement.querySelector('mat-progress-bar')).toBeNull()
  })
})
