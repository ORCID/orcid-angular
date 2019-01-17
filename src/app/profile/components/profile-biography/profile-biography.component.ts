import { Component, OnInit } from '@angular/core'
import { Input } from '@angular/core'
import { Person } from '../../../types'
import { environment } from '../../../../environments/environment'

@Component({
  selector: 'app-profile-biography',
  templateUrl: './profile-biography.component.html',
  styleUrls: ['./profile-biography.component.scss'],
})
export class ProfileBiographyComponent implements OnInit {
  constructor() {}
  @Input() profileGeneralData: Person
  @Input() id: String
  environment = environment

  ngOnInit() {}
}
