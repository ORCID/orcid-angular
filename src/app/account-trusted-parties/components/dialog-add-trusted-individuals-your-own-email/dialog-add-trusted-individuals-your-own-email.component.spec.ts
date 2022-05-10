import { ComponentFixture, TestBed } from '@angular/core/testing'
import { DialogAddTrustedIndividualsYourOwnEmailComponent } from './dialog-add-trusted-individuals-your-own-email.component'


describe('DialogAddTrustedIndividualsComponent', () => {
  let component: DialogAddTrustedIndividualsYourOwnEmailComponent
  let fixture: ComponentFixture<DialogAddTrustedIndividualsYourOwnEmailComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogAddTrustedIndividualsYourOwnEmailComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddTrustedIndividualsYourOwnEmailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
