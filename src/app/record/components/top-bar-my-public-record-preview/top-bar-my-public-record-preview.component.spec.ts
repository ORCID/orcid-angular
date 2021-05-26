import { ComponentFixture, TestBed } from '@angular/core/testing'


import { TopBarMyPublicRecordPreviewComponent } from './top-bar-my-public-record-preview.component'

describe('TopBarMyPublicRecordPreviewComponent', () => {
  let component: TopBarMyPublicRecordPreviewComponent
  let fixture: ComponentFixture<TopBarMyPublicRecordPreviewComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopBarMyPublicRecordPreviewComponent],

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarMyPublicRecordPreviewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
