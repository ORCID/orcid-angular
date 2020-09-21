import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-oauth-error',
  templateUrl: './oauth-error.component.html',
  styleUrls: ['./oauth-error.component.scss']
})
export class OauthErrorComponent implements OnInit {
  @Input() errorDescription: string

  constructor() { }

  ngOnInit(): void {
  }

}
