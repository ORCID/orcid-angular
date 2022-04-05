import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { ExpandedSearchResultsContent } from 'src/app/types'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-dialog-add-trusted-individuals',
  templateUrl: './dialog-add-trusted-individuals.component.html',
  styleUrls: ['./dialog-add-trusted-individuals.component.scss'],
})
export class DialogAddTrustedIndividualsComponent implements OnInit {
  isMobile: boolean
  baseUrl = environment.BASE_URL
  addByEmail: string
  constructor(
    private matRef: MatDialogRef<DialogAddTrustedIndividualsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExpandedSearchResultsContent | string,
    private _platform: PlatformInfoService
  ) {}

  ngOnInit(): void {
    this._platform.get().subscribe((platform) => {
      this.isMobile = platform.columns4 || platform.columns8
    })
    if (typeof this.data === 'string') {
      this.addByEmail = this.data
    }
  }
  cancel() {
    this.matRef.close()
  }
  ok() {
    this.matRef.close(this.data)
  }
}
