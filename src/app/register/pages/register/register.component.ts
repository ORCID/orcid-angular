import { Component, OnInit, ViewChild, Injectable, Inject } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { PlatformInfoService, PlatformInfo } from 'src/app/cdk/platform-info'
import { StepperSelectionEvent } from '@angular/cdk/stepper'
import { RegisterForm } from 'src/app/types/register.endpoint'
import { RegisterService } from 'src/app/core/register/register.service'
import { IsThisYouComponent } from 'src/app/cdk/is-this-you'
import { switchMap } from 'rxjs/operators'
import { MatStep } from '@angular/material/stepper'
import { MatDialog } from '@angular/material/dialog'
import { WINDOW } from 'src/app/cdk/window'
import { Router } from '@angular/router'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @ViewChild('lastStep') lastStep: MatStep

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
    private _dialog: MatDialog,
    @Inject(WINDOW) private window: Window
  ) {
    _platformInfo.get().subscribe(platform => {
      this.platform = platform
    })
  }
  ngOnInit() {
    this._register.getRegisterForm().subscribe()
  }

  register(value) {
    this.lastStep.interacted = true
    if (
      this.FormGroupStepA.valid &&
      this.FormGroupStepB.valid &&
      this.FormGroupStepC.valid
    ) {
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
          if (response.url) {
            this.window.location.href = response.url
          } else {
            // TODO @leomendoza123 HANDLE ERROR show toaster
          }
        })
    } else {
      // TODO @leomendoza123 HANDLE ERROR show toaster
    }
  }

  afterStepASubmitted() {
    console.log('SUBMIT')
    // Update the personal data object is required after submit since is an input for StepB
    console.log(this.FormGroupStepA.value)
    if (this.FormGroupStepA.valid) {
      console.log('SUBMIT!!')
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
      // TODO @leomendoza123 HANDLE ERROR show toaster
    }
  }

  submitStepB() {}

  submitStepC() {}

  openDialog(duplicateRecords): void {
    const dialogParams = {
      width: `1078px`,
      height: `600px`,
      maxWidth: `90vw`,

      data: {
        duplicateRecords,
        titleLabel: '$localize`:@@register.titleLabel:Could this be you?',
        bodyLabel:
          // tslint:disable-next-line: max-line-length
          '$localize`:@@register.bodyLabel:We found some accounts with your name, which means you may have already created an ORCID iD using a different email address. Before creating an account, please confirm that none of these records belong to you. Not sure if any of these are you?',
        contactLabel: '$localize`:@@register.contactLabel:Contact us.',
        firstNameLabel: '$localize`:@@register.firstNameLabel:First Name',
        lastNameLabel: '$localize`:@@register.lastNameLabel:Last Name',
        affiliationsLabel:
          '$localize`:@@register.affiliationsLabel:Affiliations',
        dateCreatedLabel: '$localize`:@@register.dateCreatedLabel:Date Created',
        viewRecordLabel: '$localize`:@@register.viewRecordLabel:View Record',
        signinLabel:
          '$localize`:@@register.signinLabel:I ALREADY HAVE AN ID, GO BACK TO SIGN IN',
        continueLabel:
          '$localize`:@@register.continueLabel:NONE OF THESE ARE ME, CONTINUE WITH REGISTRATION',
      },
    }

    if (this.platform.tabletOrHandset) {
      dialogParams['maxWidth'] = '95vw'
      dialogParams['maxHeight'] = '95vh'
    }

    const dialogRef = this._dialog.open(IsThisYouComponent, dialogParams)

    dialogRef.afterClosed().subscribe(confirmRegistration => {
      if (confirmRegistration) {
      }
    })
  }

  selectionChange(event: StepperSelectionEvent) {
    console.log(event)
    if (event.previouslySelectedIndex === 0) {
      this.afterStepASubmitted()
    }
  }
}
