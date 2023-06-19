import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TermsOfUseComponent } from './terms-of-use.component'
import { DeveloperToolsService } from 'src/app/core/developer-tools/developer-tools.service'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { RecordService } from 'src/app/core/record/record.service'
import { of } from 'rxjs'

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
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(TermsOfUseComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
