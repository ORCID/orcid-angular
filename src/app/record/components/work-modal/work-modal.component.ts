import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info';
import { WorkTypes } from 'src/app/types/works.endpoint';

@Component({
  selector: 'app-work-modal',
  templateUrl: './work-modal.component.html',
  styleUrls: ['./work-modal.component.scss']
})
export class WorkModalComponent implements OnInit {

  loading = true
  workForm: FormGroup
  platform: PlatformInfo;

  workTypes = {
    [WorkTypes.conference] : $localize`Conference`,
    [WorkTypes.intellectual_property] : $localize`Intellectual property`,
    [WorkTypes.other_output] : $localize`Other output`,
    [WorkTypes.publication] : $localize`Publication`,
  }

  constructor(private fb: FormBuilder, private _platform: PlatformInfoService) { }

  ngOnInit(): void {
    this._platform.get().subscribe(value => {
      this.platform = value
    })
    this.workForm = this.fb.group({workType: {'', ['']}}])
  }

  saveEvent () {

  }
  closeEvent(){

  }

}
