import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ModalNameComponent } from './modal-name.component'

describe('ModalNameComponent', () => {
  let component: ModalNameComponent
  let fixture: ComponentFixture<ModalNameComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ModalNameComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNameComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
