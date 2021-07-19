import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeleteWorksComponent } from './modal-delete-works.component';

describe('ModalDeleteWorksComponent', () => {
  let component: ModalDeleteWorksComponent;
  let fixture: ComponentFixture<ModalDeleteWorksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDeleteWorksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeleteWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
