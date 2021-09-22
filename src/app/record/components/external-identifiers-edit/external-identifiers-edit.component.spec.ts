import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalIdentifiersEditComponent } from './external-identifiers-edit.component';

describe('ExternalIdentifiersEditComponent', () => {
  let component: ExternalIdentifiersEditComponent;
  let fixture: ComponentFixture<ExternalIdentifiersEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalIdentifiersEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalIdentifiersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
