import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ModalKeywordComponent } from './modal-keyword.component'

describe('ModalKeywordComponent', () => {
  let component: ModalKeywordComponent
  let fixture: ComponentFixture<ModalKeywordComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalKeywordComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalKeywordComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
