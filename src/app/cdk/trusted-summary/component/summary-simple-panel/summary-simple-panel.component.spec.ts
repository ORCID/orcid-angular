import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SummarySimplePanelComponent } from './summary-simple-panel.component'
import { WINDOW_PROVIDERS } from 'src/app/cdk/window'

describe('SummarySimplePanelComponent', () => {
  let component: SummarySimplePanelComponent
  let fixture: ComponentFixture<SummarySimplePanelComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SummarySimplePanelComponent],
      providers: [WINDOW_PROVIDERS],
    }).compileComponents()

    fixture = TestBed.createComponent(SummarySimplePanelComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
