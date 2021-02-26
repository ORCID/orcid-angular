import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSourceComponent } from './card-source.component';

describe('CardSourceComponent', () => {
  let component: CardSourceComponent;
  let fixture: ComponentFixture<CardSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
