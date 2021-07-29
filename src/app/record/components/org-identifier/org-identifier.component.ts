import { Component, Input, OnInit } from '@angular/core'
import { OrgDisambiguated } from '../../../types'
import { OrganizationsService } from '../../../core'
import { URL_REGEXP } from '../../../constants'

@Component({
  selector: 'app-org-identifier',
  templateUrl: './org-identifier.component.html',
  styleUrls: ['./org-identifier.component.scss']
})
export class OrgIdentifierComponent implements OnInit {
  @Input() orgDisambiguated: OrgDisambiguated

  constructor(
    private _organizationsService: OrganizationsService,
  ) { }

  ngOnInit(): void {
  }


  getLink(type: string, value: string) {
    return this._organizationsService.getLink(type, value)
  }

  /**
   * RegEx function to check if the elements contains a URL
   */
  isUrl(element) {
    return RegExp(URL_REGEXP).test(element)
  }
}
