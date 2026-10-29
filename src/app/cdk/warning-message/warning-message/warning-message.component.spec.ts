import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WarningMessageComponent } from './warning-message.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../window'
import { PlatformInfoService } from '../../platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('WarningMessageComponent', () => {
  let component: WarningMessageComponent
  let fixture: ComponentFixture<WarningMessageComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [WarningMessageComponent],
      providers: [
        WINDOW_PROVIDERS,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningMessageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  /*
   * PD-5635. These two pin the design system's notice colours on the component
   * rather than on a screen that happens to use it. The values are the frames'
   * own tokens - notice-warning #d32f2f on notice-warning-background #ffebee,
   * notice-success #56b833 on state-success-bg #f9fef6 - and before this the
   * banner drew #ff9c00 and #7faa26 on no background at all. A Material or
   * palette change that puts either back should fail here and say so.
   */
  const wrapperOf = (type: 'warning' | 'success') => {
    component.type = type
    fixture.detectChanges()
    return fixture.nativeElement.querySelector('.wrapper') as HTMLElement
  }

  it('draws a warning in the design system notice-warning colours', () => {
    const style = getComputedStyle(wrapperOf('warning'))

    expect(style.borderTopColor).toBe('rgb(211, 47, 47)')
    expect(style.backgroundColor).toBe('rgb(255, 235, 238)')
    expect(component.icon).toBe('warning')
  })

  it('draws a success in the design system notice-success colours', () => {
    const style = getComputedStyle(wrapperOf('success'))

    expect(style.borderTopColor).toBe('rgb(86, 184, 51)')
    expect(style.backgroundColor).toBe('rgb(249, 254, 246)')
    expect(component.icon).toBe('thumb_up')
  })
})
