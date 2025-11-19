import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrcidUi } from './orcid-ui';

describe('OrcidUi', () => {
  let component: OrcidUi;
  let fixture: ComponentFixture<OrcidUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrcidUi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrcidUi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
