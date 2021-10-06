import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TopBarVerificationEmailModalComponent } from './top-bar-verification-email-modal.component'

describe('TopBarVerificationEmailModalComponent', () => {
  let component: TopBarVerificationEmailModalComponent
  let fixture: ComponentFixture<TopBarVerificationEmailModalComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopBarVerificationEmailModalComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarVerificationEmailModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
