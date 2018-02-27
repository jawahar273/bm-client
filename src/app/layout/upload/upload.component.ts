import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

import { CommonService } from '../../services/common.services';
import { routerTransition } from '../../router.animations';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  animations: [routerTransition()],
})
export class UploadComponent implements OnInit {
  public uploadForm: FormGroup;
  constructor(public service: CommonService, private fb: FormBuilder) { 
  	// console.log('jkfdljfklafjlakf')
    this.uploadForm = this.fb.group({
    	'UploadFile': ''
    });
  }

  ngOnInit() {
  }

  public uploadFormSubmit() {
  	console.log(this.uploadForm.value);
  }

}
