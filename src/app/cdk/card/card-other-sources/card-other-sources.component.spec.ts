import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardOtherSourcesComponent } from './card-other-sources.component';

describe('CardOtherSourcesComponent', () => {
  let component: CardOtherSourcesComponent;
  let fixture: ComponentFixture<CardOtherSourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardOtherSourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardOtherSourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
