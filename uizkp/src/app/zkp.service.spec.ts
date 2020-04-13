import { TestBed } from '@angular/core/testing';

import { ZkpService } from './zkp.service';

describe('ZkpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ZkpService = TestBed.get(ZkpService);
    expect(service).toBeTruthy();
  });
});
