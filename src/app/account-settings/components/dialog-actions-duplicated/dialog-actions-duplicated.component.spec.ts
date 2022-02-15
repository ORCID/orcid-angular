import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogActionsDuplicatedComponent } from './dialog-actions-duplicated.component';

describe('DialogActionsDuplicatedComponent', () => {
  let component: DialogActionsDuplicatedComponent;
  let fixture: ComponentFixture<DialogActionsDuplicatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogActionsDuplicatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogActionsDuplicatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
