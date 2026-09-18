import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PageNotFoundComponent } from './page-not-found.component'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent
  let fixture: ComponentFixture<PageNotFoundComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageNotFoundComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    fixture = TestBed.createComponent(PageNotFoundComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
