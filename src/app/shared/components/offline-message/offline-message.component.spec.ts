import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineMessageComponent } from './offline-message.component';

describe('OfflineMessageComponent', () => {
  let component: OfflineMessageComponent;
  let fixture: ComponentFixture<OfflineMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
