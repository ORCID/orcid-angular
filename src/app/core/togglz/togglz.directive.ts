import {
  Directive,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  Input,
} from '@angular/core'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'

@Directive({
  selector: '[appTogglz]',
  standalone: false,
})
export class TogglzDirective implements OnInit {
  @Input() appTogglz: string
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private _togglz: TogglzService
  ) {}

  ngOnInit() {
    this.isEnabled().subscribe((enable) => {
      if (enable) {
        this.viewContainer.createEmbeddedView(this.templateRef)
      } else {
        this.viewContainer.clear()
      }
    })
  }

  isEnabled(): Observable<boolean> {
    return this._togglz.getTogglz().pipe(
      map((features) => {
        return features.messages[this.appTogglz] === 'true'
      })
    )
  }
}
