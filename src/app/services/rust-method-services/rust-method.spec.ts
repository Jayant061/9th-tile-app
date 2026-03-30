import { TestBed } from '@angular/core/testing';

import { RustMethod } from './rust-method.service';

describe('RustMethod', () => {
  let service: RustMethod;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RustMethod);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
