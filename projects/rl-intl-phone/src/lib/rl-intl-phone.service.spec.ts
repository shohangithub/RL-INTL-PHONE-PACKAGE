import { TestBed } from '@angular/core/testing';

import { RlIntlPhoneService } from './rl-intl-phone.service';

describe('RlIntlPhoneService', () => {
  let service: RlIntlPhoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RlIntlPhoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
