import { Component, Inject, OnInit } from '@angular/core'
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { ExpandedSearchResultsContent } from 'src/app/types'

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
