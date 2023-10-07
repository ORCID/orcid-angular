import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TrustedIndividualsDropdownComponent } from './trusted-individuals-dropdown.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'

describe('TrustedIndividualsDropdownComponent', () => {
  let component: TrustedIndividualsDropdownComponent
  let fixture: ComponentFixture<TrustedIndividualsDropdownComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatMenuModule],
      declarations: [TrustedIndividualsDropdownComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TrustedIndividualsDropdownComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
