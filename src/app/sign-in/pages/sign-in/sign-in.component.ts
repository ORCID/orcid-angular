import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}
}
