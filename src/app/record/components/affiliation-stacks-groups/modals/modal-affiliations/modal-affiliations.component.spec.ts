import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAffiliationsComponent } from './modal-affiliations.component';

describe('ModalAffiliationsComponent', () => {
  let component: ModalAffiliationsComponent;
  let fixture: ComponentFixture<ModalAffiliationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAffiliationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAffiliationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
