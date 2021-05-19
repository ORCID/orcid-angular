import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModalFooterComponent } from './modal-footer.component'

describe('ModalFooterComponent', () => {
  let component: ModalFooterComponent
  let fixture: ComponentFixture<ModalFooterComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalFooterComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFooterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
