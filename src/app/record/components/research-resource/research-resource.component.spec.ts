import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchResourceComponent } from './research-resource.component';

describe('ResearchResourceComponent', () => {
  let component: ResearchResourceComponent;
  let fixture: ComponentFixture<ResearchResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearchResourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
