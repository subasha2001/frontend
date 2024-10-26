import { TestBed } from '@angular/core/testing';

import { GoldSilverService } from './gold-silver.service';

describe('GoldSilverService', () => {
  let service: GoldSilverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoldSilverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
