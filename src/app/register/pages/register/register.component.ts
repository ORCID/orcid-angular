import { Component, OnInit, ViewChild } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { PlatformInfoService, PlatformInfo } from 'src/app/cdk/platform-info'
import { MatStep, MatDialog } from '@angular/material'
import { StepperSelectionEvent } from '@angular/cdk/stepper'
import { RegisterForm } from 'src/app/types/register.endpoint'
import { RegisterService } from 'src/app/core/register/register.service'
import { IsThisYouComponent } from 'src/app/cdk/is-this-you'
import { switchMap } from 'rxjs/operators'

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
  backendForm: RegisterForm
  constructor(
    _platformInfo: PlatformInfoService,
    private _register: RegisterService,
    private _dialog: MatDialog
  ) {
    _platformInfo.get().subscribe(platform => {
      this.platform = platform
    })
  }
  ngOnInit() {
    this._register.getRegisterForm().subscribe()
  }

  register(value) {
    console.log(value)
    this.lastStep.interacted = true
    if (
      this.FormGroupStepA.valid &&
      this.FormGroupStepB.valid &&
      this.FormGroupStepC.valid
    ) {
      const form = this._register.formGroupToFullRegistrationForm(
        this.FormGroupStepA,
        this.FormGroupStepB,
        this.FormGroupStepC
      )
      console.log(form)
      this._register
        .backendRegisterFormValidate(
          this.FormGroupStepA,
          this.FormGroupStepB,
          this.FormGroupStepC
        )
        .pipe(
          switchMap(() =>
            this._register.register(
              this.FormGroupStepA,
              this.FormGroupStepB,
              this.FormGroupStepC
            )
          )
        )
        .subscribe(response => {
          console.log(response)
        })
    } else {
      console.log('WAIT SOMETHING IS NOT VALID SOMEWHERE ')
      console.log('FormGroupStepA', this.FormGroupStepA)
      console.log('FormGroupStepB', this.FormGroupStepB)
      console.log('FormGroupStepC', this.FormGroupStepC)
      console.log({
        ...this.FormGroupStepA.value.personal,
        ...this.FormGroupStepB.value.password,
        ...this.FormGroupStepB.value.sendOrcidNews,
        ...this.FormGroupStepC.value.activitiesVisibilityDefault,
        ...this.FormGroupStepC.value.termsOfUse,
      })
    }
  }

  submitStepA() {
    console.log(this.FormGroupStepA)
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
          // continueRegistration
        }
      })
  }

  submitStepB() {
    console.log(this.FormGroupStepB)
  }

  submitStepC() {
    console.log(this.FormGroupStepC)
  }

  openDialog(duplicateRecords): void {
    const dialogParams = {
      width: `1078px`,
      height: `600px`,
      maxWidth: `90vw`,

      data: {
        duplicateRecords,
        // titleLabel: this.titleLabel.nativeElement.innerHTML,
        // bodyLabel:this.bodyLabel.nativeElement.innerHTML,
        // contactLabel: this.contactLabel.nativeElement.innerHTML,
        // firstNameLabel: this.firstNameLabel.nativeElement.innerHTML,
        // affiliationsLabel: this.affiliationsLabel.nativeElement.innerHTML,
        // dateCreatedLabel: this.dateCreatedLabel.nativeElement.innerHTML,
        // viewRecordLabel: this.viewRecordLabel.nativeElement.innerHTML,
        // signinLabel: this.signinLabel.nativeElement.innerHTML,
        // continueLabel: this.continueLabel.nativeElement.innerHTML,
      },
    }

    if (this.platform.tabletOrHandset) {
      dialogParams['maxWidth'] = '95vw'
      dialogParams['maxHeight'] = '95vh'
    }

    const dialogRef = this._dialog.open(IsThisYouComponent, dialogParams)

    dialogRef.afterClosed().subscribe(confirmRegistration => {
      if (confirmRegistration) {
        // this._register.confirmRegistration(registrationForm)
      }
    })
  }
}
