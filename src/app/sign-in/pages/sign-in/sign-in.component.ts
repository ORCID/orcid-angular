import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material'
import { IsThisYouComponent } from 'src/app/cdk/is-this-you/is-this-you.component'

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.dialog.open(IsThisYouComponent, {
      width: `1078px`,
      data: {},
    })
  }
}
