import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelDetailsComponent } from './panel-details.component';

describe('PanelDetailsComponent', () => {
  let component: PanelDetailsComponent;
  let fixture: ComponentFixture<PanelDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
