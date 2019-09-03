import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, FormBuilder } from '@angular/forms'
import { PasswordRecoveryService } from 'src/app/core/password-recovery/password-recovery.service'

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss'],
})
export class PasswordRecoveryComponent implements OnInit {
  selected = false
  value = false

  recoveryForm = new FormGroup({
    type: new FormControl(''),
    email: new FormControl(''),
  })

  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  select() {
    this.selected = !this.selected
  }

  onSubmit() {
    console.log(this.recoveryForm.getRawValue())
  }

  click(a) {
    console.log(a)
  }
}
