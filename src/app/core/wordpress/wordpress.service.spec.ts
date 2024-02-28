import { TestBed } from '@angular/core/testing';

import { WordpressService } from './wordpress.service';

describe('WordpressService', () => {
  let service: WordpressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordpressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
