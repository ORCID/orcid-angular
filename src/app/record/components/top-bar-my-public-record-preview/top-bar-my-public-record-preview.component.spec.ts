import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TopBarMyPublicRecidPreviewComponent } from './top-bar-my-public-record-preview.component'

describe('TopBarMyPublicRecidPreviewComponent', () => {
  let component: TopBarMyPublicRecidPreviewComponent
  let fixture: ComponentFixture<TopBarMyPublicRecidPreviewComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopBarMyPublicRecidPreviewComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarMyPublicRecidPreviewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
