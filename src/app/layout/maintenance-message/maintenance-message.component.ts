import { Component, OnInit } from '@angular/core'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { CookieService } from 'ngx-cookie-service'

@Component({
  selector: 'app-maintenance-message',
  templateUrl: './maintenance-message.component.html',
  styleUrls: [
    './maintenance-message.component.scss-theme.scss',
    './maintenance-message.component.scss',
  ],
})
export class MaintenanceMessageComponent implements OnInit {
  maintenanceMessage
  closableElements: NodeListOf<Element>
  closableElement: Element
  nonClosableElements: NodeListOf<Element>
  constructor(togglz: TogglzService, private _cookie: CookieService) {
    togglz.getMessageOf('MAINTENANCE_MESSAGE').subscribe(value => {
      this.maintenanceMessage = value
      const parser = new DOMParser()
      const htmlElement = parser.parseFromString(
        this.maintenanceMessage,
        'text/html'
      )
      this.closableElements = htmlElement.querySelectorAll('div.closable')
      this.nonClosableElements = htmlElement.querySelectorAll('div.regular')
      this.updateClosableMessage()
    })
  }

  updateClosableMessage() {
    this.closableElements.forEach(node => {
      if (
        node &&
        node.id &&
        !this._cookie.check(node.id) &&
        !this.closableElement
      ) {
        this.closableElement = node
      }
    })
  }

  understoodClosableMessage(element: Element) {
    this.closableElement = null
    this._cookie.set(element.id, 'understood', 365)
    this.updateClosableMessage()
  }

  ngOnInit() {}
}
