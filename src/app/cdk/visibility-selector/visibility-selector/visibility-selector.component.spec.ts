import { ComponentFixture, TestBed } from '@angular/core/testing'

import { VisibilitySelectorComponent } from './visibility-selector.component'
import { MatMenuModule } from '@angular/material/menu'
import { MatButtonModule } from '@angular/material/button'
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
