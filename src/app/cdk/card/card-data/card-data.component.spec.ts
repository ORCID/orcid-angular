import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDataComponent } from './card-data.component';

describe('CardDataComponent', () => {
  let component: CardDataComponent;
  let fixture: ComponentFixture<CardDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
