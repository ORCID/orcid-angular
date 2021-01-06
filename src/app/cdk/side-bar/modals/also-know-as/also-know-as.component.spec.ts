import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlsoKnowAsComponent } from './also-know-as.component';

describe('AlsoKnowAsComponent', () => {
  let component: AlsoKnowAsComponent;
  let fixture: ComponentFixture<AlsoKnowAsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlsoKnowAsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlsoKnowAsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
