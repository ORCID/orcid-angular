import { Component, Input, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-documentation-page',
  standalone: true,
  imports: [],
  templateUrl: './documentation-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./documentation-page.component.scss'],
})
export class DocumentationPageComponent {
  @Input() title: string = ''
  @Input() description: string = ''
}
