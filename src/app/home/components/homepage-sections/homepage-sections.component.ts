import { Component, Input } from '@angular/core'

import { SECTION_HEADING_LEVEL } from '../../heading-level'
import { HomepageSection } from 'src/app/types/homepage-content.v2'
import { packSectionRows } from '../../section-rows'
import { HomepageSectionComponent } from '../homepage-section/homepage-section.component'

/**
 * Lay the sections out, pairing adjacent half-width ones into a row.
 *
 * DOM order is exactly document order, so focus order always matches reading
 * order and right-to-left languages mirror for free. A row is a plain block
 * until the wide tier, where it becomes two columns.
 */
@Component({
  selector: 'app-homepage-sections',
  templateUrl: './homepage-sections.component.html',
  styleUrls: ['./homepage-sections.component.scss'],
  standalone: true,
  imports: [HomepageSectionComponent],
})
export class HomepageSectionsComponent {
  @Input({ required: true }) set sections(value: HomepageSection[]) {
    this.rows = packSectionRows(value ?? [])
  }

  rows: HomepageSection[][] = []

  /** Every section heading sits at the same level, directly under the page h1. */
  readonly level = SECTION_HEADING_LEVEL

  trackRow(index: number, row: HomepageSection[]): string {
    return row.map((section) => section.id).join('+')
  }

  trackSection(index: number, section: HomepageSection): string {
    return section.id
  }
}
