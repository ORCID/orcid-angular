import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeleteItemsComponent } from './modal-delete-items.component';

describe('ModalDeleteItemsComponent', () => {
  let component: ModalDeleteItemsComponent;
  let fixture: ComponentFixture<ModalDeleteItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDeleteItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeleteItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
