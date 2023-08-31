import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SummaryPanelComponent } from './summary-panel.component'
import { WINDOW_PROVIDERS } from 'src/app/cdk/window'

describe('SummaryPanelComponent', () => {
  let component: SummaryPanelComponent
  let fixture: ComponentFixture<SummaryPanelComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SummaryPanelComponent],
      providers: [WINDOW_PROVIDERS],
    }).compileComponents()

    fixture = TestBed.createComponent(SummaryPanelComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
