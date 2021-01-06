import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSideBarComponent } from './modal-side-bar.component';

describe('ModalSideBarComponent', () => {
  let component: ModalSideBarComponent;
  let fixture: ComponentFixture<ModalSideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSideBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
