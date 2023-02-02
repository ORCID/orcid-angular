import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { ExpandedSearchResultsContent } from 'src/app/types'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-dialog-add-trusted-individuals-your-own-email',
  templateUrl: './dialog-add-trusted-individuals-your-own-email.component.html',
  styleUrls: ['./dialog-add-trusted-individuals-your-own-email.component.scss'],
})
export class DialogAddTrustedIndividualsYourOwnEmailComponent
  implements OnInit
{
  constructor(
    private matRef: MatDialogRef<DialogAddTrustedIndividualsYourOwnEmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExpandedSearchResultsContent | string
  ) {}

  ngOnInit(): void {}
  cancel() {
    this.matRef.close()
  }
}
