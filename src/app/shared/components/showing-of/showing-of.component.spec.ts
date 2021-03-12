import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ShowingOfComponent } from './showing-of.component'

describe('ShowingOfComponent', () => {
  let component: ShowingOfComponent
  let fixture: ComponentFixture<ShowingOfComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ShowingOfComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowingOfComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
