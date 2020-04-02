import { Component, OnInit, ViewChild } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { PlatformInfoService, PlatformInfo } from 'src/app/cdk/platform-info'
import { MatStep } from '@angular/material'

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
  constructor(_platformInfo: PlatformInfoService) {
    _platformInfo.get().subscribe(platform => {
      this.platform = platform
    })
  }
  ngOnInit() {}

  register() {
    this.lastStep.interacted = true
  }
}
