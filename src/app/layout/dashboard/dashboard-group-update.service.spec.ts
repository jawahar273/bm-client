import { TestBed, inject } from '@angular/core/testing';

import { DashboardGroupUpdateService } from './dashboard-group-update.service';

describe('DashboardGroupUpdateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardGroupUpdateService]
    });
  });

  it('should be created', inject([DashboardGroupUpdateService], (service: DashboardGroupUpdateService) => {
    expect(service).toBeTruthy();
  }));
});
