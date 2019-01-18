import { Component, Input, OnInit } from '@angular/core'
import { listAnimation } from 'src/app/animations'
import { Person } from 'src/app/types'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-profile-general-data',
  templateUrl: './profile-general-data.component.html',
  styleUrls: ['./profile-general-data.component.scss'],
  animations: [listAnimation],
})
export class ProfileGeneralDataComponent implements OnInit {
  @Input() profileGeneralData: Person
  @Input() id: String
  environment = environment

  constructor() {}

  ngOnInit() {}

  goToPrintView() {
    window.location.href = `${environment.BASE_URL}${this.id}/print`
  }
}
