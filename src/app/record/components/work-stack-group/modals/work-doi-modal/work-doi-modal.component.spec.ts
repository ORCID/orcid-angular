import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkDoiModalComponent } from './work-doi-modal.component';

describe('WorkDoiModalComponent', () => {
  let component: WorkDoiModalComponent;
  let fixture: ComponentFixture<WorkDoiModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkDoiModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkDoiModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
