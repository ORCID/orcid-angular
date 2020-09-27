import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MyOrcidComponent } from './my-orcid.component'

describe('MyOrcidComponent', () => {
  let component: MyOrcidComponent
  let fixture: ComponentFixture<MyOrcidComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyOrcidComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOrcidComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
