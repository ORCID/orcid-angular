import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss'],
})
export class PasswordRecoveryComponent implements OnInit {
  selected = false
  constructor() {}

  ngOnInit() {}

  select() {
    this.selected = !this.selected
  }
}
