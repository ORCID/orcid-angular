import { ComponentFixture, TestBed } from '@angular/core/testing'

import { OfflineMessageComponent } from './offline-message.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('OfflineMessageComponent', () => {
  let component: OfflineMessageComponent
  let fixture: ComponentFixture<OfflineMessageComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfflineMessageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineMessageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
