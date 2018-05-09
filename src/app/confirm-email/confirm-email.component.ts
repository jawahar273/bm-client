import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { routerTransition } from '../router.animations';
import { CommonService } from '../services/common.services';


@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss'],
  animations: [routerTransition()]
})
export class ConfirmEmailComponent implements OnInit {

  public confirmToken: string;
  public spinnerIcon: boolean;


  constructor(public service: CommonService, private router: ActivatedRoute, private pathHandler: Router) { 

      this.router.params.subscribe( param => {

          this.confirmToken = param['token'];

      });

      this.spinnerIcon = true;

  }

  ngOnInit() {
  }

  public setLoadSpinner(value: boolean) {

    this.spinnerIcon = value;

  }

  public submitConfirmEmailToken(): void {

      const body = {'key': this.confirmToken };
      this.service.post(`rest-auth/registration/verify-email`, this.service.headers, body)
      .subscribe((data) => {

          this.service.showGlobalAlert(`${data['detail']} its done. Ready to login.`, 'success');
          this.setLoadSpinner(true);
          setTimeout(() => {

              this.pathHandler.navigate(['/login']);

          }, 2500);

      }, (error) => {

          const msg = this.service.isClinetOrServerSidesError(error);
          this.service.showGlobalAlert(msg);
          this.setLoadSpinner(true);

      });
      this.setLoadSpinner(false);

  }

}
