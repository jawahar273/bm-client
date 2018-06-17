import { Injectable } from '@angular/core';
import { CommonService } from '../../services/common.services';

@Injectable()
export class LayoutService {

  constructor(public service: CommonService) { }

  public updateAirPollution(): void {

      if (!this.service.airPollutionKeys) {

          this.service.getAirPollution();

      }

  }

}
