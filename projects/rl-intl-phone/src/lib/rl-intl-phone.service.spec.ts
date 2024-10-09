import { TestBed } from '@angular/core/testing';

import { RLIntlPhoneService } from './rl-intl-phone.service';

describe('RlIntlPhoneService', () => {
  let service: RLIntlPhoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RLIntlPhoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
