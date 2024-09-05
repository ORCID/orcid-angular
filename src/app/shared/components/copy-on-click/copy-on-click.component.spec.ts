import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CopyOnClickComponent } from './copy-on-click.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('CopyOnClickComponent', () => {
  let component: CopyOnClickComponent
  let fixture: ComponentFixture<CopyOnClickComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CopyOnClickComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyOnClickComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
