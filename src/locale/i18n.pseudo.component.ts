// This module is required until Angular Support $localize extract values from .ts files
// https://github.com/angular/angular/pull/32912

import { Component, OnInit, NgModule } from '@angular/core'

@Component({
    selector: 'app-i18n.pseudo',
    templateUrl: './i18n.pseudo.component.html',
    standalone: false
})
export class I18nPseudoComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}

@NgModule({
  imports: [],
  declarations: [I18nPseudoComponent],
})
export class PseudoModule {}
