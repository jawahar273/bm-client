import { TestBed, inject } from '@angular/core/testing';

import { DashBoardServiceService } from './dash-board-service.service';

describe('DashBoardServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashBoardServiceService]
    });
  });

  it('should be created', inject([DashBoardServiceService], (service: DashBoardServiceService) => {
    expect(service).toBeTruthy();
  }));
});
