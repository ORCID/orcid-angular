import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordHeaderLoadingComponent } from './record-header-loading.component';

describe('RecordHeaderLoadingComponent', () => {
  let component: RecordHeaderLoadingComponent;
  let fixture: ComponentFixture<RecordHeaderLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordHeaderLoadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordHeaderLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
