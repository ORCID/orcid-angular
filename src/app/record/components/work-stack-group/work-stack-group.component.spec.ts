import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkStackGroupComponent } from './work-stack-group.component';

describe('WorkStackGroupComponent', () => {
  let component: WorkStackGroupComponent;
  let fixture: ComponentFixture<WorkStackGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkStackGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkStackGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
