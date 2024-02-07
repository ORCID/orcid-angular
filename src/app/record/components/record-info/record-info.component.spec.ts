import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordInfoComponent } from './record-info.component';

describe('InfoComponent', () => {
  let component: RecordInfoComponent;
  let fixture: ComponentFixture<RecordInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecordInfoComponent]
    });
    fixture = TestBed.createComponent(RecordInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
