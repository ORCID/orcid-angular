import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { DuplicateRemoveEndpoint } from 'src/app/types/account-actions-duplicated'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-dialog-actions-duplicated-merged-confirmed',
  templateUrl: './dialog-actions-duplicated-merged-confirmed.component.html',
  styleUrls: ['./dialog-actions-duplicated-merged-confirmed.component.scss'],
  preserveWhitespaces: true,
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
