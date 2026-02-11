import { ComponentFixture, TestBed } from '@angular/core/testing'

import { OrcidRegistryUi } from './orcid-registry-ui'

describe('OrcidRegistryUi', () => {
  let component: OrcidRegistryUi
  let fixture: ComponentFixture<OrcidRegistryUi>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrcidRegistryUi],
    }).compileComponents()

    fixture = TestBed.createComponent(OrcidRegistryUi)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
