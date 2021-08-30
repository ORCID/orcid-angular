import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkExternalIdModalComponent } from './work-external-id-modal.component';

describe('WorkDoiModalComponent', () => {
  let component: WorkExternalIdModalComponent;
  let fixture: ComponentFixture<WorkExternalIdModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkExternalIdModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkExternalIdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
