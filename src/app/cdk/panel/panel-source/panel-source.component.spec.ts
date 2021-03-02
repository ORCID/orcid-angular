import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelSourceComponent } from './panel-source.component';

describe('PanelSourceComponent', () => {
  let component: PanelSourceComponent;
  let fixture: ComponentFixture<PanelSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
