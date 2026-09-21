import { ComponentFixture, TestBed } from '@angular/core/testing'

import { InfoPanelComponent } from './info-panel.component'

describe('InfoPanelComponent', () => {
  let component: InfoPanelComponent
  let fixture: ComponentFixture<InfoPanelComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoPanelComponent],
    })
    fixture = TestBed.createComponent(InfoPanelComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  /*
   * PD-5635. The frames draw an information panel in state-info-dark #1565c0 on
   * state-info-bg #f5fafe; this took the darkest step of the ramp (#0d47a1) on
   * a different fill (#f1f8fe).
   */
  it('draws itself in the design system information colours', () => {
    const panel = fixture.nativeElement.querySelector('.info') as HTMLElement
    const style = getComputedStyle(panel)

    expect(style.borderTopColor).toBe('rgb(21, 101, 192)')
    expect(style.backgroundColor).toBe('rgb(245, 250, 254)')
  })
})
