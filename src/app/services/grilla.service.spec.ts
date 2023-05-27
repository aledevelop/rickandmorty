import { TestBed } from '@angular/core/testing';

import { GrillaService } from './grilla.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GrillaService', () => {
  let service: GrillaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(GrillaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
