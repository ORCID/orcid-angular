import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DeepSelectInputComponent } from './deep-select-input.component'
import { PlatformInfoService } from '../../platform-info'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { get } from 'lodash'
import { of } from 'rxjs'
import { MatMenuModule } from '@angular/material/menu'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { MatDividerModule } from '@angular/material/divider'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'

describe('DeepSelectInputComponent', () => {
  let component: DeepSelectInputComponent
  let fixture: ComponentFixture<DeepSelectInputComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeepSelectInputComponent],
      providers: [
        {
          provide: PlatformInfoService,
          useValue: {
            get: () => of({}),
          },
        },
      ],
      imports: [
        MatMenuModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatDividerModule,
        NoopAnimationsModule,
      ],
    })
    fixture = TestBed.createComponent(DeepSelectInputComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
