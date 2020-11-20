import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowingOfComponent } from './showing-of.component';

describe('ShowingOfComponent', () => {
  let component: ShowingOfComponent;
  let fixture: ComponentFixture<ShowingOfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowingOfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowingOfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
