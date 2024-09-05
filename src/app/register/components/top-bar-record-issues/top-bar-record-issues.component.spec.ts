import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TopBarRecordIssuesComponent } from './top-bar-record-issues.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('TopBarRecordIssuesComponent', () => {
  let component: TopBarRecordIssuesComponent
  let fixture: ComponentFixture<TopBarRecordIssuesComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopBarRecordIssuesComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarRecordIssuesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
