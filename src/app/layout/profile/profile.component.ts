import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { CommonService } from '../../services/common.services';
import { routerTransition } from '../../router.animations';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [routerTransition()],
})
export class ProfileComponent implements OnInit {
  public profileForm: FormGroup;
  constructor(public service: CommonService, public profileFormBuilder: FormBuilder) {
     // this.profileForm = this.profileFormBuilder({

     // });
  }

  ngOnInit() {
  }

  public getUserProfileURL() {
  	return localStorage.getItem('userProfileURL');
  }

}
