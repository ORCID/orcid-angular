import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModalWorksSearchLinkComponent } from './modal-works-search-link.component'

describe('ModalWorksSearchLink.Component.HtmlComponent', () => {
  let component: ModalWorksSearchLinkComponent
  let fixture: ComponentFixture<ModalWorksSearchLinkComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalWorksSearchLinkComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalWorksSearchLinkComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
