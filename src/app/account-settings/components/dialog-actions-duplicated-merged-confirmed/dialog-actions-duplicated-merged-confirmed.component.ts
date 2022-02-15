import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { DuplicateRemoveEndpoint } from 'src/app/types/account-actions-duplicated'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-dialog-actions-duplicated-merged-confirmed',
  templateUrl: './dialog-actions-duplicated-merged-confirmed.component.html',
  styleUrls: ['./dialog-actions-duplicated-merged-confirmed.component.scss'],
})
export class DialogActionsDuplicatedMergedConfirmedComponent implements OnInit {
  baseUrl = environment.BASE_URL

  constructor(
    private matRef: MatDialogRef<DialogActionsDuplicatedMergedConfirmedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DuplicateRemoveEndpoint
  ) {}

  ngOnInit(): void {}

  ok() {
    this.matRef.close(this.data)
  }
}
