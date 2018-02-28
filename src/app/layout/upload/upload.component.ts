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
  // public uploadForm: FormGroup;
  public flagForUpload: boolean;
  public flagMsg: string;
  constructor(public service: CommonService) { 
  	// console.log('jkfdljfklafjlakf')
    this.flagForUpload = false;
    this.flagMsg = '';
  }

  ngOnInit() {
  }

  public onChangeFile(event) {
    console.log(event.srcElement.files[0]);
    const file = event.srcElement.files[0];
    this.flagForUpload = false;
    if (!(file.name.endsWith('.csv') || file.name.endsWith('.xlxs'))) {
       this.flagForUpload = true; 
       this.flagMsg = 'It is highly recommented to use MS-Excel 2007+/CSV only';
    }
    if (file.size > 262144) {
       this.flagForUpload = true; 
       this.flagMsg = 'Huge file size(equal or about of 2 MB) is not allowed.';
    }
  }

  public onSubmitUploadFile() {
  	// console.log(this.uploadForm.value);
    debugger;
    console.log('djklajkfld');
  }

}
