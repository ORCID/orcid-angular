import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { RecordWorksService } from '../../../../../core/record-works/record-works.service'
import { Work } from '../../../../../types/record-works.endpoint'
import { first } from 'rxjs/operators'
import { FormControl, FormGroup } from '@angular/forms'
import bibtexParse from '@orcid/bibtex-parse-js'
import latexParse from 'src/assets/scripts/latexParse.js'

@Component({
  selector: 'app-work-doi-bibtex-modal',
  templateUrl: './work-bibtex-modal.component.html',
  styleUrls: ['./work-bibtex-modal.component.scss'],
})
export class WorkBibtexModalComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  importForm: FormGroup
  loadingWorks = false
  bibtexParsingErrorText = ''
  bibtexParsingError = false
  worksFromBibtex: Work[] = []
  selectedWorks: Work[] = []
  selectAll: false
  group: { [key: string]: FormGroup } = {}
  addedWorkCount = 0

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _recordWorksService: RecordWorksService,
  ) {
  }

  ngOnInit(): void {}

  bibTexInputChange($fileInputEvent: any) {
    this.loadingWorks = true
    const textFiles = $fileInputEvent.target.files
    const worksFromBibtex = []
    for (const bibtex of textFiles) {
      const reader = new FileReader()
      reader.readAsText(bibtex)

      const that = this

      reader.onloadend = function(e) {
        const parsed = bibtexParse.toJSON(reader.result)
        if (typeof parsed === 'string' && parsed.substring(0, 5).toLowerCase().indexOf('error') > -1) {
          that.bibtexParsingErrorText = parsed
          that.bibtexParsingError = true
        } else {
          const blankWork: Work = undefined
          const newWorks = []
          while (parsed.length > 0) {
            const cur = parsed.shift()
            const bibtexEntry = cur.entryType.toLowerCase()
            if (bibtexEntry !== 'preamble' && bibtexEntry !== 'comment') {
              // Filtering @PREAMBLE and @COMMENT
              newWorks.push(that.populateWork(cur))
            }
          }
          that._recordWorksService
            .worksValidate(newWorks)
            .pipe(first())
            .subscribe(data => {
              data.forEach((work) => {
                that.worksFromBibtex.push(work)
              })
              that.worksFromBibtex.forEach((w) => {
                const newPutCode = 'new-' + that.addedWorkCount++
                w.putCode = {
                  value: newPutCode
                }
                that.group[newPutCode] = new FormGroup({
                  checked: new FormControl(false),
                })
              })
              that.importForm = new FormGroup(that.group)
              that.loadingWorks = false
            })
        }
      }
    }
  }

  populateWork(bibJSON): Work {
    const work = {} as Work
    const bibtex = bibtexParse.toBibtex([bibJSON])
    work.citation = { 'citation': { 'value': bibtex }, 'citationType': { 'value': 'bibtex' } }

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
        lowerKeyTags[key.toLowerCase()] = tags[key]
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

      if (lowerKeyTags.hasOwnProperty('eprint')
        && lowerKeyTags.hasOwnProperty('eprinttype') && lowerKeyTags['eprinttype'] === 'arxiv') {
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

      if (lowerKeyTags.hasOwnProperty('month')) {
        let month = lowerKeyTags['month'].trim()
        if (bibMonths.indexOf(month.trim().substring(0, 3)) >= 0) {
          month = bibMonths.indexOf(month.trim().substring(0, 3)) + 1
        }
        if (!isNaN(month) && month > 0 && month <= 12) {
          work.publicationDate = {
            month: this.pad(month, 2),
          }
        }
      }

      if (lowerKeyTags.hasOwnProperty('url')) {
        work.url = {
          value: lowerKeyTags['url'],
        }
      }

    }
    return work
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
        'value': value,
      },
      externalIdentifierType: {
        'value': idType,
      },
      relationship: {
        'value': relationship,
      },
    }

    if (work.workExternalIdentifiers[0].externalIdentifierId.value == null) {
      work.workExternalIdentifiers[0] = ident
      // Only adds the url if there is no other identifier
    } else if (idType !== 'uri') {
      work.workExternalIdentifiers.push(ident)
    }
  };

  pad(num: number, size: number): string {
    let s = num + ''
    while (s.length < size) {
      s = '0' + s
    }
    return s
  }

  updateCheckAll() {
    this.worksFromBibtex.forEach((work) => {
      console.log(work.putCode.value)
      if (this.selectedWorks.some((w) => w.putCode.value === work.putCode.value)) {
        if (!!this.selectAll === false) {
          this.selectedWorks = this.selectedWorks.filter(
            (w) => w.putCode.value !== work.putCode.value,
          )
        }
      } else {
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
    if (this.selectedWorks.some((w) => w.putCode.value === work.putCode.value)) {
      if (!!this.selectAll === false) {
        this.selectedWorks = this.selectedWorks.filter(
          (value) => value.putCode.value !== work.putCode.value,
        )
      }
    } else {
      this.selectedWorks.push(work)
    }
  }

  saveEvent() {
    this.loadingWorks = true
    if (this.selectedWorks.length > 0 ) {
      this.selectedWorks.forEach((work, index) => {
        this._recordWorksService.save(work)
          .subscribe(() => {
            if (index === this.selectedWorks.length - 1) {
              this.loadingWorks = false
              this.closeEvent()
            }
        })
      })
    }
  }

  closeEvent() {
    this.dialogRef.close()
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}

export const bibMonths = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

export const bibToWorkTypeMap = {}
bibToWorkTypeMap['article'] = ['publication', 'journal-article']
bibToWorkTypeMap['book'] = ['publication', 'book']
bibToWorkTypeMap['booklet'] = ['other_output', 'other']
bibToWorkTypeMap['conference'] = ['conference', 'conference-paper']
bibToWorkTypeMap['inbook'] = ['publication', 'book-chapter']
bibToWorkTypeMap['incollection'] = ['publication', 'book-chapter']
bibToWorkTypeMap['inproceedings'] = ['conference', 'conference-paper']
bibToWorkTypeMap['manual'] = ['publication', 'manual']
bibToWorkTypeMap['mastersthesis'] = ['publication',
  'supervised-student-publication']
bibToWorkTypeMap['misc'] = ['other_output', 'other']
bibToWorkTypeMap['phdthesis'] = ['publication', 'dissertation-thesis']
bibToWorkTypeMap['proceedings'] = ['conference', 'conference-paper']
bibToWorkTypeMap['techreport'] = ['publication', 'report']
bibToWorkTypeMap['unpublished'] = ['other_output', 'other']

