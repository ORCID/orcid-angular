import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TermsOfUseComponent } from './terms-of-use.component'
import { DeveloperToolsService } from 'src/app/core/developer-tools/developer-tools.service'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { RecordService } from 'src/app/core/record/record.service'
import { of } from 'rxjs'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { useAnimation } from '@angular/animations'

describe('TermsOfUseComponent', () => {
  let component: TermsOfUseComponent
  let fixture: ComponentFixture<TermsOfUseComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TermsOfUseComponent],
      providers: [
        { provide: DeveloperToolsService, useValue: {} },
        { provide: PlatformInfoService, useValue: {} },
        { provide: RecordService, useValue: { getRecord: () => of() } },
        { provide: MatDialog, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(TermsOfUseComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
