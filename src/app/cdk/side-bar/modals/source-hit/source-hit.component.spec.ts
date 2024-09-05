import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SourceHitComponent } from './source-hit.component'
import { SharedModule } from '../../../../shared/shared.module'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('SourceHitComponent', () => {
  let component: SourceHitComponent
  let fixture: ComponentFixture<SourceHitComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [SourceHitComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceHitComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
