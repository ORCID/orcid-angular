import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ModalHeaderComponent } from './modal-header.component'

describe('ModalHeaderComponent', () => {
  let component: ModalHeaderComponent
  let fixture: ComponentFixture<ModalHeaderComponent>

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ModalHeaderComponent],
      }).compileComponents()
    })
  )

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalHeaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
