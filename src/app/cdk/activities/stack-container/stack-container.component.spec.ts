import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackContainerComponent } from './stack-container.component';

describe('StackContainerComponent', () => {
  let component: StackContainerComponent;
  let fixture: ComponentFixture<StackContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
