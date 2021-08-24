import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModalExportWorksComponent } from './modal-export-works.component'

describe('ModalExportWorksComponent', () => {
  let component: ModalExportWorksComponent
  let fixture: ComponentFixture<ModalExportWorksComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalExportWorksComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalExportWorksComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
