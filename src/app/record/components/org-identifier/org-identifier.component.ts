import { Component, Input, OnInit } from '@angular/core'
import { OrgDisambiguated } from '../../../types'
import { OrganizationsService } from '../../../core'
import { URL_REGEXP_BACKEND } from '../../../constants'

@Component({
    selector: 'app-org-identifier',
    templateUrl: './org-identifier.component.html',
    styleUrls: ['./org-identifier.component.scss'],
    preserveWhitespaces: true,
    standalone: false
})
export class OrgIdentifierComponent implements OnInit {
  @Input() orgDisambiguated: OrgDisambiguated

  constructor(private _organizationsService: OrganizationsService) {}

  ngOnInit(): void {}
}
