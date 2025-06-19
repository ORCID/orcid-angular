import { Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { forkJoin, Subject } from 'rxjs'
import { Work } from '../../../../../types/record-works.endpoint'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { RecordWorksService } from '../../../../../core/record-works/record-works.service'
import { PlatformInfoService } from '../../../../../cdk/platform-info'
import { map, takeUntil } from 'rxjs/operators'
import { GroupingSuggestions, Suggestion } from 'src/app/types/works.endpoint'
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms'

@Component({
  selector: 'app-modal-combine-works-with-selector',
  templateUrl: './modal-combine-works-with-selector.component.html',
  styleUrls: [
    './modal-combine-works-with-selector.component.scss',
    './modal-combine-works-with-selector.component.scss-theme.scss',
  ],
})
export class ModalCombineWorksWithSelectorComponent
  implements OnInit, OnDestroy
{
  $destroy: Subject<boolean> = new Subject<boolean>()

  isMobile: boolean
  loadingWorks = false
  putCodes: string[] = []
  suggestionGroups: number[][]
  suggestions: Suggestion[]
  form: UntypedFormGroup
  suggestionsWorks: { works: Work[]; putCodes: string }[]
  selectSetOfWorksToCombine: string[] = []

  constructor(
    private _fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<ModalComponent>,
    private _platform: PlatformInfoService,
    private _recordWorksService: RecordWorksService,
    @Inject(MAT_DIALOG_DATA) public data: GroupingSuggestions
  ) {}

  ngOnInit(): void {
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
      })

    this.suggestions = this.data.suggestions
    this.loadingWorks = true
    const suggestionObservableList = this.suggestions?.map((group) => {
      const groupObservableList = group.putCodes.map((putCode) =>
        this._recordWorksService.getWorkInfo(putCode + '')
      )
      return forkJoin(groupObservableList).pipe(
        map((works) => {
          return { works, putCodes: group.putCodesAsString }
        })
      )
    })
    if (suggestionObservableList) {
      forkJoin(suggestionObservableList).subscribe((value) => {
        this.suggestionsWorks = value
        const formObject = {}
        value.forEach((suggestionGroup) => {
          formObject[suggestionGroup.putCodes] = [false]
        })
        this.form = this._fb.group(formObject)
        this.form.valueChanges.subscribe(() => {
          this.getSetOkWorkToCombine()
        })
        this.loadingWorks = false
      })
    }
  }

  saveEvent() {
    this.getSetOkWorkToCombine()

    if (this.selectSetOfWorksToCombine.length) {
      const putCodesToMerge = this.selectSetOfWorksToCombine.map((putCodes) => {
        return this._recordWorksService.combinePutCodes(putCodes)
      })

      this.loadingWorks = true
      return forkJoin(putCodesToMerge).subscribe(() => {
        this.loadingWorks = false
        this.closeEvent()
      })
    } else {
      this.closeEvent()
    }
  }

  private getSetOkWorkToCombine() {
    this.selectSetOfWorksToCombine = Object.keys(this.form.value).filter(
      (putCodes) => {
        return this.form.value[putCodes]
      }
    )
  }

  closeEvent() {
    this.dialogRef.close()
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
