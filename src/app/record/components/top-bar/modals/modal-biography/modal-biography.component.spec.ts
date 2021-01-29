import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBiographyComponent } from './modal-biography.component';

describe('ModalBiographyComponent', () => {
  let component: ModalBiographyComponent;
  let fixture: ComponentFixture<ModalBiographyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBiographyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBiographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
