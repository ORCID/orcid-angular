import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBarRecordIssuesComponent } from './top-bar-record-issues.component';

describe('TopBarRecordIssuesComponent', () => {
  let component: TopBarRecordIssuesComponent;
  let fixture: ComponentFixture<TopBarRecordIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopBarRecordIssuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarRecordIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
