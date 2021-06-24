import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import {
  WorkCategoryLabels,
  WorkTypesLabels,
} from 'src/app/types/works.endpoint'

@Component({
  selector: 'app-work-modal',
  templateUrl: './work-modal.component.html',
  styleUrls: ['./work-modal.component.scss'],
})
export class WorkModalComponent implements OnInit {
  loading = true
  workForm: FormGroup
  platform: PlatformInfo

  workCategories = WorkCategoryLabels
  workTypes

  constructor(
    private fb: FormBuilder,
    private _platform: PlatformInfoService
  ) {}

  ngOnInit(): void {
    this._platform.get().subscribe((value) => {
      this.platform = value
    })
    this.workForm = this.fb.group({
      workCategory: ['', []],
      workType: ['', []],
      title: ['', []],
      translationTitle: ['', []],
      subtitle: ['', []],
      journalTitle: ['', []],
      publicationDate: ['', []],
      visibility: ['', []],

    })
    this.workForm.get('workCategory').valueChanges.subscribe((value) => {
      this.workTypes = WorkTypesLabels[value]
    })
  }

  saveEvent() {}
  closeEvent() {}
}
