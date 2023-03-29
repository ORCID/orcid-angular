import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { RecordWorksService } from '../../../../../core/record-works/record-works.service'
import { Work } from '../../../../../types/record-works.endpoint'
import { first } from 'rxjs/operators'
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms'
import bibtexParse from '@orcid/bibtex-parse-js'
import latexParse from 'src/assets/scripts/latexParse.js'
import { WINDOW } from 'src/app/cdk/window'
import { SnackbarService } from '../../../../../cdk/snackbar/snackbar.service'
import { UserRecord } from '../../../../../types/record.local'
import { TogglzService } from 'src/app/core/togglz/togglz.service'

@Component({
  selector: 'app-work-doi-bibtex-modal',
  templateUrl: './work-bibtex-modal.component.html',
  styleUrls: [
    './work-bibtex-modal.component.scss',
    './work-bibtex-modal.component.scss-theme.scss',
  ],
})
export class WorkBibtexModalComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  @Input() userRecord: UserRecord

  importForm: UntypedFormGroup
  loadingWorks = false
  bibtexErrorParsingText = ''
  bibtexErrorParsing = false
  bibtexErrorNoEntries = false
  worksFromBibtex: Work[] = []
  selectedWorks: Work[] = []
  selectAll: false
  group: { [key: string]: UntypedFormGroup } = {}
  addedWorkCount = 0
  isAnInvalidWork = false

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _snackBar: SnackbarService,
    private _recordWorksService: RecordWorksService,
    @Inject(WINDOW) private _window: Window,
    private _togglz: TogglzService
  ) {}

  ngOnInit(): void {}

  bibTexInputChange($fileInputEvent: any) {
    this._togglz
      .getStateOf('ADD_OTHER_WORK_CONTRIBUTORS_WITH_BIBTEX')
      .subscribe((ADD_OTHER_WORK_CONTRIBUTORS_WITH_BIBTEX_TOGGLZ) => {
        this.bibtexErrorParsingText = undefined
        this.bibtexErrorParsing = false
        this.loadingWorks = true
        const textFiles = $fileInputEvent.target.files
        for (const bibtex of textFiles) {
          const reader = new FileReader()
          reader.readAsText(bibtex)

          const that = this

          reader.onloadend = function (e) {
            let parsed = null
            try {
              parsed = bibtexParse.toJSON(reader.result)

              if (
                typeof parsed === 'string' &&
                parsed.substring(0, 5).toLowerCase().indexOf('error') > -1
              ) {
                that.bibtexErrorParsingText = parsed
                that.bibtexErrorParsing = true
                that.loadingWorks = false
              } else {
                if (parsed) {
                  const newWorks = []
                  if (parsed.length === 0) {
                    that.bibtexErrorNoEntries = true
                    that.loadingWorks = false
                  }
                  while (parsed.length > 0) {
                    const cur = parsed.shift()
                    const bibtexEntry = cur.entryType.toLowerCase()
                    if (
                      bibtexEntry !== 'preamble' &&
                      bibtexEntry !== 'comment'
                    ) {
                      newWorks.push(
                        that.populateWork(
                          cur,
                          ADD_OTHER_WORK_CONTRIBUTORS_WITH_BIBTEX_TOGGLZ
                        )
                      )
                    }
                  }
                  if (newWorks.length > 0) {
                    that._recordWorksService
                      .worksValidate(newWorks)
                      .pipe(first())
                      .subscribe((data) => {
                        that.worksFromBibtex = []
                        data.forEach((work) => {
                          that.worksFromBibtex.push(work)
                          if (work.errors.length > 0 && !that.isAnInvalidWork) {
                            that.isAnInvalidWork = true
                            that._snackBar.showValidationError()
                          }
                        })
                        that.worksFromBibtex.forEach((w) => {
                          const newPutCode = 'new-' + that.addedWorkCount++
                          w.putCode = {
                            value: newPutCode,
                          }
                          that.group[newPutCode] = new UntypedFormGroup({
                            checked: new UntypedFormControl(false),
                          })
                        })
                        that.importForm = new UntypedFormGroup(that.group)
                        that.loadingWorks = false
                      })
                  }
                }
              }
            } catch (e) {
              that.bibtexErrorParsingText = e
              that.bibtexErrorParsing = true
              that.loadingWorks = false
            }
          }
        }
      })
  }

  populateWork(
    bibJSON,
    ADD_OTHER_WORK_CONTRIBUTORS_WITH_BIBTEX_TOGGLZ: boolean
  ): Work {
    const work = {} as Work
    const bibtex = bibtexParse.toBibtex([bibJSON])

    work.citation = {
      citation: { value: bibtex },
      citationType: { value: 'bibtex' },
    }

    // set the work type based off the entry type
    if (bibJSON.entryType) {
      const type = bibJSON.entryType.toLowerCase()

      if (bibToWorkTypeMap.hasOwnProperty(type)) {
        work.workCategory = {
          value: latexParse.decodeLatex(bibToWorkTypeMap[type][0]),
        }
        work.workType = {
          value: bibToWorkTypeMap[type][1],
        }
      }
    }
    // tags we mapped
    if (bibJSON.entryTags) {
      // create a lower case create a reference map
      const tags = bibJSON.entryTags
      const lowerKeyTags = {}
      for (const key in tags) {
        if (tags.hasOwnProperty(key)) {
          lowerKeyTags[key.toLowerCase()] = tags[key]
        }
      }

      if (lowerKeyTags.hasOwnProperty('booktitle')) {
        if (!lowerKeyTags.hasOwnProperty('title')) {
          work.title = {
            value: latexParse.decodeLatex(lowerKeyTags['booktitle']),
          }
        } else if (!lowerKeyTags.hasOwnProperty('journal')) {
          work.journalTitle = {
            value: latexParse.decodeLatex(lowerKeyTags['booktitle']),
          }
        }
      }

      if (lowerKeyTags.hasOwnProperty('doi')) {
        this.externalIdentifierId(work, 'doi', lowerKeyTags['doi'])
      }

      if (lowerKeyTags.hasOwnProperty('pmid')) {
        this.externalIdentifierId(work, 'pmid', lowerKeyTags['pmid'])
      }

      if (
        lowerKeyTags.hasOwnProperty('eprint') &&
        lowerKeyTags.hasOwnProperty('eprinttype') &&
        lowerKeyTags['eprinttype'] === 'arxiv'
      ) {
        this.externalIdentifierId(work, 'arxiv', tags['eprint'])
      }

      if (lowerKeyTags.hasOwnProperty('isbn')) {
        this.externalIdentifierId(work, 'isbn', lowerKeyTags['isbn'])
      }

      if (lowerKeyTags.hasOwnProperty('issn')) {
        this.externalIdentifierId(work, 'issn', lowerKeyTags['issn'])
      }

      // pissn, eissn and lissn are all issn's
      if (lowerKeyTags.hasOwnProperty('pissn')) {
        this.externalIdentifierId(work, 'issn', lowerKeyTags['pissn'])
      }

      if (lowerKeyTags.hasOwnProperty('eissn')) {
        this.externalIdentifierId(work, 'issn', lowerKeyTags['eissn'])
      }

      if (lowerKeyTags.hasOwnProperty('lissn')) {
        this.externalIdentifierId(work, 'issn', lowerKeyTags['lissn'])
      }

      if (lowerKeyTags.hasOwnProperty('url')) {
        this.externalIdentifierId(work, 'uri', lowerKeyTags['url'])
      }

      if (lowerKeyTags.hasOwnProperty('journal')) {
        work.journalTitle = {
          value: latexParse.decodeLatex(lowerKeyTags['journal']),
        }
      }

      if (lowerKeyTags.hasOwnProperty('title')) {
        work.title = {
          value: latexParse.decodeLatex(lowerKeyTags['title']),
        }
      }

      if (lowerKeyTags.hasOwnProperty('year')) {
        if (!isNaN(lowerKeyTags['year'])) {
          work.publicationDate = {
            year: lowerKeyTags['year'].trim(),
          }
        }
      }

      // only set month if year provided
      if (
        lowerKeyTags.hasOwnProperty('month') &&
        lowerKeyTags.hasOwnProperty('year')
      ) {
        if (
          !isNaN(lowerKeyTags['year']) &&
          lowerKeyTags['year'].trim() !== ''
        ) {
          let month = lowerKeyTags['month'].trim()
          if (bibMonths.indexOf(month.trim().substring(0, 3)) >= 0) {
            month = bibMonths.indexOf(month.trim().substring(0, 3)) + 1
          }
          if (!isNaN(month) && month > 0 && month <= 12) {
            work.publicationDate = {
              year: lowerKeyTags['year'].trim(),
              month: this.pad(month, 2),
            }
          }
        }
      }

      if (lowerKeyTags.hasOwnProperty('url')) {
        work.url = {
          value: lowerKeyTags['url'],
        }
      }

      if (ADD_OTHER_WORK_CONTRIBUTORS_WITH_BIBTEX_TOGGLZ) {
        work.contributorsGroupedByOrcid = []
        if (lowerKeyTags.hasOwnProperty('author')) {
          const authors = this.removeEndingAnd(lowerKeyTags['author'])
          this.addContributors(
            authors.split(' and '),
            'author',
            work
          )
        }
        if (lowerKeyTags.hasOwnProperty('editor')) {
          const editors = this.removeEndingAnd(lowerKeyTags['editor'])
          this.addContributors(
            editors.split(' and '),
            'editor',
            work
          )
        }
      }
    }
    return work
  }

  addContributors(
    contributors: string[],
    type: 'author' | 'editor',
    work: Work
  ) {
    contributors.forEach((contributor) => {
      contributor = latexParse.decodeLatex(contributor).trim()
      if (contributor) {
        work.contributorsGroupedByOrcid.push({
          creditName: {
            content: contributor,
          },
          rolesAndSequences: [
            {
              contributorRole: type,
              contributorSequence: null,
            },
          ],
        })
      }
    })
  }

  externalIdentifierId(work, idType, value) {
    if (!value) {
      console.warn('Empty value for ext id: ' + idType)
      return
    }

    // Define relationship type based on work type
    let relationship = 'self'
    if (idType === 'issn') {
      if (work.workType.value !== 'book') {
        relationship = 'part-of'
      }
    } else if (idType === 'isbn') {
      const isbnWorkSelfWorkTypes = ['book', 'manual', 'report', 'other_output']
      if (isbnWorkSelfWorkTypes.indexOf(work.workType.value) < 0) {
        relationship = 'part-of'
      }
    }

    const ident = {
      externalIdentifierId: {
        value: value,
      },
      externalIdentifierType: {
        value: idType,
      },
      relationship: {
        value: relationship,
      },
    }
    if (work.workExternalIdentifiers === undefined) {
      work.workExternalIdentifiers = []
      work.workExternalIdentifiers[0] = ident
    } else if (
      work.workExternalIdentifiers[0]?.externalIdentifierId?.value == null
    ) {
      work.workExternalIdentifiers[0] = ident
      // Only adds the url if there is no other identifier
    } else if (idType !== 'uri') {
      work.workExternalIdentifiers.push(ident)
    }
  }

  pad(num: number, size: number): string {
    let s = num + ''
    while (s.length < size) {
      s = '0' + s
    }
    return s
  }

  updateCheckAll() {
    this.selectedWorks = []
    this.worksFromBibtex.forEach((work) => {
      if (this.selectAll) {
        this.selectedWorks.push(work)
      }
      this.importForm.patchValue({
        [work.putCode.value]: {
          checked: !!this.selectAll,
        },
      })
    })
  }

  updateCheck(work: Work) {
    if (
      this.selectedWorks.some((w) => w.putCode.value === work.putCode.value)
    ) {
      this.selectedWorks = this.selectedWorks.filter(
        (value) => value.putCode.value !== work.putCode.value
      )
    } else {
      this.selectedWorks.push(work)
    }
  }

  saveEvent() {
    if (this.selectedWorks.length > 0) {
      this.loadingWorks = true
      this.selectedWorks.forEach((work, index) => {
        work.putCode = null
        this._recordWorksService
          .save(work, !(index === this.selectedWorks.length - 1))
          .subscribe(() => {
            if (index === this.selectedWorks.length - 1) {
              this.loadingWorks = false
              this.worksFromBibtex = []
              this.closeEvent()
            }
          })
      })
    } else {
      this._snackBar.showValidationError(
        $localize`:@@shared.youHaveNotSelectedImport:You haven’t selected any items to import.`,
        $localize`:@@shared.pleaseReview:Please review and fix the issue`
      )
    }
  }

  private displayBackendError(errorMessage: string) {
    this._snackBar.showValidationError(
      errorMessage,
      $localize`:@@shared.pleaseReview:Please review and fix the issue`
    )
  }

  private getCreditNameFromUserRecord(): string {
    const creditName = this.userRecord?.names?.creditName?.value
    const givenNames = this.userRecord?.names?.givenNames?.value
    const familyName = this.userRecord?.names?.familyName?.value

    if (creditName) {
      return creditName
    } else {
      return familyName ? `${givenNames} ${familyName}` : givenNames
    }
  }

  private removeEndingAnd(contributors: string): string {
    if (contributors.endsWith(' and')) {
      contributors = contributors.substring(0, contributors.length - 4)
    }

    return contributors
  }

  closeEvent() {
    this.dialogRef.close()
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}

export const bibMonths = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
]

export const bibToWorkTypeMap = {}
bibToWorkTypeMap['article'] = ['publication', 'journal-article']
bibToWorkTypeMap['book'] = ['publication', 'book']
bibToWorkTypeMap['booklet'] = ['other_output', 'other']
bibToWorkTypeMap['conference'] = ['conference', 'conference-paper']
bibToWorkTypeMap['inbook'] = ['publication', 'book-chapter']
bibToWorkTypeMap['incollection'] = ['publication', 'book-chapter']
bibToWorkTypeMap['inproceedings'] = ['conference', 'conference-paper']
bibToWorkTypeMap['manual'] = ['publication', 'manual']
bibToWorkTypeMap['mastersthesis'] = [
  'publication',
  'supervised-student-publication',
]
bibToWorkTypeMap['misc'] = ['other_output', 'other']
bibToWorkTypeMap['phdthesis'] = ['publication', 'dissertation-thesis']
bibToWorkTypeMap['proceedings'] = ['conference', 'conference-paper']
bibToWorkTypeMap['techreport'] = ['publication', 'report']
bibToWorkTypeMap['unpublished'] = ['other_output', 'other']
