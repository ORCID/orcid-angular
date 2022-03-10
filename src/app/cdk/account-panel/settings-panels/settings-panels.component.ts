import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'

@Component({
  selector: 'app-settings-panels',
  templateUrl: './settings-panels.component.html',
  styleUrls: [
    './settings-panels.component.scss',
    './settings-panels.component.scss-theme.scss',
  ],
})
export class SettingsPanelsComponent implements OnInit {
  @Input() loading = false
  @Input() expandedContent = false
  @Output() expandedContentChange: EventEmitter<boolean> = new EventEmitter()
  @Input() title: string
  @Input() accessGranted: number
  @Input() revokeAccessButton = false
  @Output() revokeAccessButtonClickedEvent = new EventEmitter<boolean>()

  @Input() url: string

  constructor(private _dialog: MatDialog) {}

  collapse() {
    this.expandedContent = !this.expandedContent
    this.expandedContentChange.emit(this.expandedContent)
  }
  revokeAccessButtonClicked() {
    this.revokeAccessButtonClickedEvent.next(true)
  }

  ngOnInit(): void {}
}
