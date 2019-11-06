import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PasswordRecoveryComponent } from './password-recovery.component'

describe('PasswordRecoveryComponent', () => {
  let component: PasswordRecoveryComponent
  let fixture: ComponentFixture<PasswordRecoveryComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordRecoveryComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordRecoveryComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
