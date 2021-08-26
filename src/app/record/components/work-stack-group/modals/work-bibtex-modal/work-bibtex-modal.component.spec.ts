import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkBibtexModalComponent } from './work-bibtex-modal.component';

describe('WorkDoiBibtexModalComponent', () => {
  let component: WorkBibtexModalComponent;
  let fixture: ComponentFixture<WorkBibtexModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkBibtexModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkBibtexModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
