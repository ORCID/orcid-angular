import { Component, Input, OnInit } from '@angular/core'
import { Person } from 'src/app/types'

@Component({
  selector: 'app-profile-biography',
  templateUrl: './profile-biography.component.html',
  styleUrls: ['./profile-biography.component.scss'],
})
export class ProfileBiographyComponent implements OnInit {
  constructor() {}
  @Input() profileGeneralData: Person

  ngOnInit() {}
}
