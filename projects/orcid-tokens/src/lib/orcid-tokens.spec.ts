import { ComponentFixture, TestBed } from '@angular/core/testing'

import { OrcidTokens } from './orcid-tokens'

describe('OrcidTokens', () => {
  let component: OrcidTokens
  let fixture: ComponentFixture<OrcidTokens>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrcidTokens],
    }).compileComponents()

    fixture = TestBed.createComponent(OrcidTokens)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
