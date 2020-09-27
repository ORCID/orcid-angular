import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CardDetailComponent } from './card-detail.component'

describe('CardDetailComponent', () => {
  let component: CardDetailComponent
  let fixture: ComponentFixture<CardDetailComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardDetailComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDetailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
