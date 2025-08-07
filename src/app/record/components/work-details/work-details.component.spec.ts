import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WorkDetailsComponent } from './work-details.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from 'src/app/cdk/window'
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MonthDayYearDateToStringPipe } from 'src/app/shared/pipes/month-day-year-date-to-string/month-day-year-date-to-string.pipe'

fdescribe('WorkDetailsComponent', () => {
  let component: WorkDetailsComponent
  let fixture: ComponentFixture<WorkDetailsComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [WorkDetailsComponent, MonthDayYearDateToStringPipe],
      providers: [WINDOW_PROVIDERS, SnackbarService, MatSnackBar, MatDialog],
    })
    fixture = TestBed.createComponent(WorkDetailsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
