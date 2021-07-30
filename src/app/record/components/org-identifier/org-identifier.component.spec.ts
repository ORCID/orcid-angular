import { ComponentFixture, TestBed } from '@angular/core/testing'

import { OrgIdentifierComponent } from './org-identifier.component'

describe('OrgIdentifierComponent', () => {
  let component: OrgIdentifierComponent
  let fixture: ComponentFixture<OrgIdentifierComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrgIdentifierComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgIdentifierComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
