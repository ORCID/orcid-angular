import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBarActionsComponent } from './top-bar-actions.component';

describe('TopBarActionsComponent', () => {
  let component: TopBarActionsComponent;
  let fixture: ComponentFixture<TopBarActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopBarActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
