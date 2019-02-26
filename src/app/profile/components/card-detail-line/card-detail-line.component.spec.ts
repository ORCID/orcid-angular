import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CardDetailLineComponent } from './card-detail-line.component'

describe('CardDetailLineComponent', () => {
  let component: CardDetailLineComponent
  let fixture: ComponentFixture<CardDetailLineComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardDetailLineComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDetailLineComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
