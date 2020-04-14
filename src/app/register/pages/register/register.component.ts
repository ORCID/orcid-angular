import { Component, OnInit, ViewChild } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { PlatformInfoService, PlatformInfo } from 'src/app/cdk/platform-info'
import { MatStep } from '@angular/material'
import { RegisterForm } from 'src/app/types/register.endpoint'
import { RegisterService } from 'src/app/core/register/register.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @ViewChild('lastStep', { static: false }) lastStep: MatStep

  platform: PlatformInfo
  FormGroupStepA: FormGroup = new FormGroup({})
  FormGroupStepB: FormGroup = new FormGroup({})
  FormGroupStepC: FormGroup = new FormGroup({})
  isLinear = true
  personalData: RegisterForm
  constructor(
    _platformInfo: PlatformInfoService,
    private _register: RegisterService
  ) {
    _platformInfo.get().subscribe(platform => {
      this.platform = platform
    })
  }
  ngOnInit() {}

  register(value) {
    console.log(value)
    // this.lastStep.interacted = true
    if (
      this.FormGroupStepA.valid &&
      this.FormGroupStepB.valid &&
      this.FormGroupStepC.valid
    ) {
      console.log('REGISTER! ')
    }
    {
      console.log('WAIT SOMETHING IS NOT VALID SOMEWHERE ')
    }
  }

  submitStepA() {
    // Update the personal data object is required after submit since is an input for StepB
    this.personalData = this.FormGroupStepA.value.personal

    this._register
      .checkDuplicatedResearcher({
        familyNames: this.personalData.familyNames.value,
        givenNames: this.personalData.givenNames.value,
      })
      .subscribe(value => {
        if (value.length > 0) {
          this.openDialog(value)
        } else {
          // this.confirmRegistration()
        }
      })
  }
}
