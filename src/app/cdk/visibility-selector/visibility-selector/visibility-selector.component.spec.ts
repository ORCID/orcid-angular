import { ComponentFixture, TestBed } from '@angular/core/testing'

import { VisibilitySelectorComponent } from './visibility-selector.component'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { WINDOW_PROVIDERS } from '../../window'

describe('VisibilitySelectorComponent', () => {
  let component: VisibilitySelectorComponent
  let fixture: ComponentFixture<VisibilitySelectorComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisibilitySelectorComponent],
      imports: [MatMenuModule, MatButtonModule],
      providers: [WINDOW_PROVIDERS],
    }).compileComponents()

    fixture = TestBed.createComponent(VisibilitySelectorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
