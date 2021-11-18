import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModalCombineWorksWithSelectorComponent } from './modal-combine-works-with-selector.component'

describe('ModalCombineWorksWithSelectorComponent', () => {
  let component: ModalCombineWorksWithSelectorComponent
  let fixture: ComponentFixture<ModalCombineWorksWithSelectorComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalCombineWorksWithSelectorComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCombineWorksWithSelectorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
