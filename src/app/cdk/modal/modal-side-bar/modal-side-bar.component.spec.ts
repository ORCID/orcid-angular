import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ModalSideBarComponent } from './modal-side-bar.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('ModalSideBarComponent', () => {
  let component: ModalSideBarComponent
  let fixture: ComponentFixture<ModalSideBarComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSideBarComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSideBarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
