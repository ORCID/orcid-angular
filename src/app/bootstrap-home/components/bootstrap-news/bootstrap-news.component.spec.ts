import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { BootstrapNewsComponent } from './bootstrap-news.component'

describe('BootstrapNewsComponent', () => {
  let component: BootstrapNewsComponent
  let fixture: ComponentFixture<BootstrapNewsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BootstrapNewsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BootstrapNewsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
