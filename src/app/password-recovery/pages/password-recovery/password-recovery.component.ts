import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, FormBuilder } from '@angular/forms'
import { PasswordRecoveryService } from 'src/app/core/password-recovery/password-recovery.service'

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss'],
  preserveWhitespaces: true,
})
export class PasswordRecoveryComponent implements OnInit {
  status = false
  value = false
  email = 'test'

  recoveryForm = new FormGroup({
    type: new FormControl(''),
    email: new FormControl(''),
  })

  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  onChipSelect(event) {
    console.log(event)
  }

  select() {
    this.status = !this.status
  }

  onSubmit() {
    console.log(this.recoveryForm.getRawValue())
  }

  chipsChange(a) {
    console.log(a)
  }
}
