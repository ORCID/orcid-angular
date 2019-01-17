import { Component, OnInit } from '@angular/core'
import { Input } from '@angular/core'
import { Person } from '../../../types'
import { environment } from '../../../../environments/environment'
import { listAnimation } from 'src/app/animations'

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
