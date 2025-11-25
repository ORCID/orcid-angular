import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-documentation-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documentation-page.component.html',
  styleUrls: ['./documentation-page.component.scss']
})
export class DocumentationPageComponent {
  @Input() title: string = '';
  @Input() description: string = '';
}
