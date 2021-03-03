import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelsStackComponent } from './panels-stack.component';

describe('PanelsStackComponent', () => {
  let component: PanelsStackComponent;
  let fixture: ComponentFixture<PanelsStackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelsStackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelsStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
