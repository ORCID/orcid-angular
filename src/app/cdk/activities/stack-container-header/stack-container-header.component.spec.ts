import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackContainerHeaderComponent } from './stack-container-header.component';

describe('StackContainerHeaderComponent', () => {
  let component: StackContainerHeaderComponent;
  let fixture: ComponentFixture<StackContainerHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackContainerHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackContainerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
