import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsActionsDeactivateComponent } from './settings-actions-deactivate.component';

describe('SettingsActionsDeactivateComponent', () => {
  let component: SettingsActionsDeactivateComponent;
  let fixture: ComponentFixture<SettingsActionsDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsActionsDeactivateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsActionsDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
