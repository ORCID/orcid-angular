import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SearchLinkWizardComponent } from './search-link-wizard.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('SearchLinkWizardComponent', () => {
  let component: SearchLinkWizardComponent
  let fixture: ComponentFixture<SearchLinkWizardComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchLinkWizardComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLinkWizardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
