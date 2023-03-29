import { LiveAnnouncer } from '@angular/cdk/a11y'
import { Injectable } from '@angular/core'
import { PageEvent } from '@angular/material/paginator'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class AnnouncerService {
  constructor(private _liveAnnouncer: LiveAnnouncer) {}
  youAreOnPageLabel = $localize`:@@shared.youAreOnPage:You are on page`
  ofLabel = $localize`:@@shared.of:of`
  thereAreLabel = $localize`:@@shared.thereAre:There are`
  onEachPageLabel = $localize`:@@shared.onEachPage:on each page`
  showingLabel = $localize`:@@shared.showing:Showing`
  lastAnnouncement: string

  liveAnnouncePagination(paginatorLabel: PageEvent, itemType: string) {
    console.log('paginatorLabel.pageIndex', paginatorLabel.pageIndex)

    const announcement =
      this.youAreOnPageLabel +
      ' ' +
      (paginatorLabel.pageIndex + 1) +
      ' ' +
      this.ofLabel +
      ' ' +
      // Total pages
      Math.ceil(paginatorLabel.length / paginatorLabel.pageSize) +
      '. ' +
      this.thereAreLabel +
      ' ' +
      paginatorLabel.pageSize +
      ' ' +
      itemType +
      ' ' +
      this.onEachPageLabel +
      '. ' +
      this.showingLabel +
      ' ' +
      paginatorLabel.pageSize +
      ' ' +
      this.ofLabel +
      ' ' +
      paginatorLabel.length +
      ' ' +
      itemType

    if (this.lastAnnouncement !== announcement) {
      this.lastAnnouncement = announcement
      this.announce(announcement)
    }
  }

  private announce(announcement: string) {
    if (environment.debugger) {
      console.debug('📢' + announcement)
    }
    this._liveAnnouncer.announce(announcement, 'assertive')
  }
}
