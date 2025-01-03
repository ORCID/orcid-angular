import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DeepSelectInputComponent } from './deep-select-input.component'
import { PlatformInfoService } from '../../platform-info'
import { FormBuilder } from '@angular/forms'
import { get } from 'lodash'
import { of } from 'rxjs'
import { MatMenuModule } from '@angular/material/menu'

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
        {
          provide: FormBuilder,
          useValue: {
            group: () => ({
              get: () => ({
                valueChanges: of(''),
              }),
            }),
          },
        },
      ],
      imports: [MatMenuModule],
    })
    fixture = TestBed.createComponent(DeepSelectInputComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
