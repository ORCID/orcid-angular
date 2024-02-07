import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordHeaderComponent } from './record-header.component';

describe('TopBarPublicNamesComponent', () => {
  let component: RecordHeaderComponent;
  let fixture: ComponentFixture<RecordHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecordHeaderComponent]
    });
    fixture = TestBed.createComponent(RecordHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
