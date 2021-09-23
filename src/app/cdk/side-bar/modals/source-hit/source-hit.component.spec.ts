import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceHitComponent } from './source-hit.component';

describe('SourceHitComponent', () => {
  let component: SourceHitComponent;
  let fixture: ComponentFixture<SourceHitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceHitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceHitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
