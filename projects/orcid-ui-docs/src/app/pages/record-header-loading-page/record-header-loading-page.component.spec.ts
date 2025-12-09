import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordHeaderLoadingPageComponent } from './record-header-loading-page.component';

describe('RecordHeaderLoadingPageComponent', () => {
  let component: RecordHeaderLoadingPageComponent;
  let fixture: ComponentFixture<RecordHeaderLoadingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordHeaderLoadingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordHeaderLoadingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
