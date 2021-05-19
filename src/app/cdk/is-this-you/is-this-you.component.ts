import { Component, OnInit, HostBinding, Inject, Optional } from '@angular/core'
import { PlatformInfoService } from '../platform-info/platform-info.service'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { WINDOW } from '../window'

@Component({
  selector: 'app-is-this-you',
  templateUrl: './is-this-you.component.html',
  styleUrls: [
    './is-this-you.component.scss.theme.scss',
    './is-this-you.component.scss',
  ],
})
export class IsThisYouComponent implements OnInit {
  titleLabel = 'Could this be you?'
  bodyLabel =
    // tslint:disable-next-line: max-line-length
    'We found some accounts with your name, which means you may have already created an ORCID iD using a different email address. Before creating an account, please confirm that none of these records belong to you. Not sure if any of these are you?'
  contactLabel = 'Contact us.'
  firstNameLabel = 'First Name'
  lastNameLabel = 'Last Name'
  affiliationsLabel = 'Affiliations'
  dateCreatedLabel = 'Date Created'
  viewRecordLabel = 'View Record'
  signinLabel = 'I ALREADY HAVE AN ID, GO BACK TO SIGN IN'
  continueLabel = 'NONE OF THESE ARE ME, CONTINUE WITH REGISTRATION'

  @HostBinding('class.edge') edge
  @HostBinding('class.ie') ie
  @HostBinding('class.tabletOrHandset') tabletOrHandset
  @HostBinding('class.handset') handset
  @HostBinding('class.tablet') tablet
  @HostBinding('class.desktop') desktop
  @HostBinding('class.columns-8') columns8
  @HostBinding('class.columns-12') columns12
  @HostBinding('class.columns-4') columns4
  constructor(
    _platformInfo: PlatformInfoService,
    @Optional() public dialogRef: MatDialogRef<IsThisYouComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    @Inject(WINDOW) private window: Window
  ) {
    _platformInfo.get().subscribe((platformInfo) => {
      this.setPlatformClasses(platformInfo)
    })
  }

  ngOnInit() {}

  setPlatformClasses(platformInfo) {
    this.ie = platformInfo.ie
    this.edge = platformInfo.edge
    this.tabletOrHandset = platformInfo.tabletOrHandset
    this.handset = platformInfo.handset
    this.tablet = platformInfo.tablet
    this.desktop = platformInfo.desktop
    this.columns8 = platformInfo.columns8
    this.columns12 = platformInfo.columns12
    this.columns4 = platformInfo.columns4
  }

  goto(url) {
    this.window.location.href = url
  }

  gotoNewTab(id) {
    this.window.open('/' + id)
  }

  confirmRegistration() {
    this.dialogRef.close(true)
  }
}
