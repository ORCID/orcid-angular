import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWorksSearchLink.Component.HtmlComponent } from './modals.component';

describe('ModalWorksSearchLink.Component.HtmlComponent', () => {
  let component: ModalWorksSearchLink.Component.HtmlComponent;
  let fixture: ComponentFixture<ModalWorksSearchLink.Component.HtmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalWorksSearchLink.Component.HtmlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalWorksSearchLink.Component.HtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
