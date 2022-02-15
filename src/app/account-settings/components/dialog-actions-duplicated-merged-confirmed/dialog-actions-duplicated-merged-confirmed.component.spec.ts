import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogActionsDuplicatedMergedConfirmedComponent } from './dialog-actions-duplicated-merged-confirmed.component';

describe('DialogActionsDuplicatedMergedConfirmedComponent', () => {
  let component: DialogActionsDuplicatedMergedConfirmedComponent;
  let fixture: ComponentFixture<DialogActionsDuplicatedMergedConfirmedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogActionsDuplicatedMergedConfirmedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogActionsDuplicatedMergedConfirmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
