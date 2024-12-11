import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core'
import { MatMenu, MatMenuTrigger } from '@angular/material/menu'

export interface DeepSelectMenu {
  isNotSelectableLabel?: boolean
  label: string
  description?: string
  value?: string
  content?: DeepSelectMenu[]
  secondaryItem?: boolean
}

@Component({
  selector: 'app-deep-select-input',
  templateUrl: './deep-select-input.component.html',
  styleUrls: ['./deep-select-input.component.scss'],
})
export class DeepSelectInputComponent {
  @Input() menu: DeepSelectMenu[] = []
  @Output() selectItem = new EventEmitter<DeepSelectMenu>()
  @ViewChild('clickHoverMenuTrigger') clickHoverMenuTrigger: MatMenuTrigger

  subMenus: { [key: string]: any } = {}
  selectedItem: DeepSelectMenu


  // Emits the selected item
  onItemSelect(item: DeepSelectMenu) {
    this.selectItem.emit(item)
    this.selectedItem = item
  }


  onSpaceBar(event: KeyboardEvent) {
    // Filter space bar key press to prevent scrolling
    if (event.code === 'Space') {
      event.preventDefault()
      event.stopPropagation()
      this.clickHoverMenuTrigger.openMenu()
    }
  }
}
