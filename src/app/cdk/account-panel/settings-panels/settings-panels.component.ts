import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { PlatformInfoService } from '../../platform-info'
import { RouterModule, Routes } from '@angular/router'

@Component({
    selector: 'app-settings-panels',
    templateUrl: './settings-panels.component.html',
    styleUrls: [
        './settings-panels.component.scss',
        './settings-panels.component.scss-theme.scss',
    ],
    preserveWhitespaces: true,
    standalone: false
})
export class SettingsPanelsComponent implements OnInit {
  @Input() loading = false
  @Input() expandedContent = false
  @Output() expandedContentChange: EventEmitter<boolean> = new EventEmitter()
  @Input() title: string
  @Input() accessGranted: number
  @Input() revokeAccessButton = false
  @Input() url: string
  @Input() type: { value: 'two-factor'; enabled: boolean }
  @Output() revokeAccessButtonClickedEvent = new EventEmitter<boolean>()
  @Input() id: string
  @Input() routeUrl: string

  trustedPartiesUrl = '/trusted-parties'
  isMobile!: boolean

  constructor(
    private _dialog: MatDialog,
    private _platform: PlatformInfoService
  ) {}

  collapse() {
    this.expandedContent = !this.expandedContent

    this.expandedContentChange.emit(this.expandedContent)
  }
  revokeAccessButtonClicked() {
    this.revokeAccessButtonClickedEvent.next(true)
  }

  ngOnInit(): void {
    this._platform.get().subscribe((platform) => {
      this.isMobile = platform.columns4 || platform.columns8
    })
  }
}
