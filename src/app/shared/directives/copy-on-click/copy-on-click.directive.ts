import { Directive, HostListener, Inject, ElementRef } from '@angular/core'
import { WINDOW } from 'src/app/core'
import { DOCUMENT } from '@angular/common'
import { MatSnackBar } from '@angular/material'
import { CopyOnClickComponent } from '../../components/copy-on-click/copy-on-click.component'

@Directive({
  selector: '[appCopyOnClick]',
})
export class CopyOnClickDirective {
  constructor(
    private contentLabel: ElementRef,
    @Inject(WINDOW) private window: Window,
    @Inject(DOCUMENT) private document: Document,
    private snackBar: MatSnackBar
  ) {}

  @HostListener('click')
  onClick() {
    const range = this.document.createRange()
    const htmlElement = this.contentLabel.nativeElement as HTMLElement
    range.selectNodeContents(htmlElement)
    const windowSelection = this.window.getSelection()
    windowSelection.removeAllRanges()
    windowSelection.addRange(range)
    let copysuccess
    try {
      copysuccess = this.document.execCommand('copy')
    } catch (e) {
      copysuccess = false
    }
    if (copysuccess) {
      this.openSnackBar()
    }
  }

  openSnackBar() {
    this.snackBar.openFromComponent(CopyOnClickComponent, {
      duration: 500,
    })
  }
}
