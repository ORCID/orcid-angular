import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { IsThisYouComponent } from 'src/app/cdk/is-this-you/is-this-you.component'

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  duplicateRecords = [
    {
      orcid: '0000-0003-0625-2121',
      email: null,
      givenNames: 'Affiliations',
      familyNames: null,
      institution: 'Public Education, Public Affiliation',
    },
    {
      orcid: '0000-0003-0625-2121',
      email: null,
      givenNames: 'Affiliations',
      familyNames: null,
      institution: 'Public Education, Public Affiliation',
    },
    {
      orcid: '0000-0003-0625-2121',
      email: null,
      givenNames: 'Affiliations',
      familyNames: null,
      institution: 'Public Education, Public Affiliation',
    },
    {
      orcid: '0000-0003-0625-2121',
      email: null,
      givenNames: 'Affiliations',
      familyNames: null,
      institution: 'Public Education, Public Affiliation',
    },
    {
      orcid: '0000-0003-0625-2121',
      email: null,
      givenNames: 'Affiliations',
      familyNames: null,
      institution: 'Public Education, Public Affiliation',
    },
    {
      orcid: '0000-0003-0625-2121',
      email: null,
      givenNames: 'Affiliations',
      familyNames: null,
      institution: 'Public Education, Public Affiliation',
    },
    {
      orcid: '0000-0003-0625-2121',
      email: null,
      givenNames: 'Affiliations',
      familyNames: null,
      institution: 'Public Education, Public Affiliation',
    },
    {
      orcid: '0000-0003-0625-2121',
      email: null,
      givenNames: 'Affiliations',
      familyNames: null,
      institution: 'Public Education, Public Affiliation',
    },
  ]

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.dialog.open(IsThisYouComponent, {
      width: `1078px`,
      data: { duplicateRecords: this.duplicateRecords },
    })
  }
}
