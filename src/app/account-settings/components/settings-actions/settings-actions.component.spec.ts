import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsActionsComponent } from './settings-actions.component'
import { WINDOW_PROVIDERS } from 'src/app/cdk/window/window.service'
import { ActivatedRoute } from '@angular/router'
import { of } from 'rxjs'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('SettingsActionsComponent', () => {
  let component: SettingsActionsComponent
  let fixture: ComponentFixture<SettingsActionsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsActionsComponent],
      providers: [
        WINDOW_PROVIDERS,
        { provide: ActivatedRoute, useValue: { fragment: of({}) } },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsActionsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
