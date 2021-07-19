import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCombineWorksComponent } from './modal-combine-works.component';

describe('ModalCombineWorksComponent', () => {
  let component: ModalCombineWorksComponent;
  let fixture: ComponentFixture<ModalCombineWorksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCombineWorksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCombineWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
