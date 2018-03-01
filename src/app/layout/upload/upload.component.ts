import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Headers } from '@angular/http';

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
  public flagForUpload: Object;
  public flagMsg: string;
  public flagForUploadBtn: Boolean;
  public entryOptionTypes: Array<Object>;
  public defaultEntryOptionType: string;
  public fileObject: any;
  constructor(public service: CommonService) { 
  	// console.log('jkfdljfklafjlakf')
    this.flagForUpload = {
      'entryType': false,
      'entryFile': false,
      'entryDummpy': false,
    };
    this.flagMsg = '';
    this.flagForUploadBtn = false;
    this.entryOptionTypes = [
      { value: 'default', name: 'None' }, // this should the first one
      { value: 'paytm', name: 'paytm' },
      { value: 'other', name: 'other' },
    ];
    this.defaultEntryOptionType = 'default';
  }

  ngOnInit() {
  }
  // ({name, value, msg, msgType}: {name: string, value: Boolean, msg: string, msgTyp: string} = {})
  public onChangEntryType(event): void {
    this.setFlagVar({name: 'entryDummy', value: false})
  }
  private setFlagVar(
     {name, value, msg, msgType}:
     {name: string, value: Boolean, msg?: string, msgType?:string} = {name: '', value: null}
    ): void {
    // refer : https://jawahar273.gitbooks.io/blog/content/Typescript/
    this.flagForUpload[name] = value;
    this.flagForUploadBtn = value;
    // this.flagMsg = msg;
    if (msg) {
      msgType = !msgType ? 'danger' : msgType
      this.service.showGlobalAlert(msg, msgType);
    }
  }
  public onChangeFile(event) {
    // console.log(event.srcElement.files[0]);
    const file = event.srcElement.files[0];
    // this.flagForUpload['entryFile'] = false;
    // this.flagForUploadBtn = false;
    this.setFlagVar({name: 'entryFile', value: false});
    if (!(file.name.endsWith('.csv') || file.name.endsWith('.xlxs'))) {
       // this.flagForUpload['entryFile'] = true; 
       const msg = 'It is highly recommented to use MS-Excel 2007+/CSV only';
       this.setFlagVar({name: 'entryFile', value: true, msg: msg});
    }
    if (file.size > 262144) {
       // this.flagForUpload['entryFile'] = true; 
       const msg = 'Huge file size(equal or about of 2 MB) is not allowed.';
       this.setFlagVar({name: 'entryFile', value: true, msg: msg});
    }
    this.fileObject = file;
  }

  public onSubmitUploadFile(value: any) {
  	// console.log(this.uploadForm.value);
    if (value['entryType'] == 'default') {
      const msg = 'upload type `None` is not allowed. Please choose other options'
      this.setFlagVar({name: 'entryType', value: true, msg: msg})
    } else {
      let url = 'package/upload';
      if (value['entryType'] == 'paytm') {
        url = 'package/paytm-upload/'
      }
      this.service.headers.append('Content-Disposition', `form-data; ${this.fileObject.name}`);
      this.service.headers.append('Content-Type', this.fileObject.type);
      this.service.post(`${url}/${this.fileObject.name}`, this.service.headers, value)
       .subscribe((data) => {

       }, (error) => {

       });
      this.service.headers.delete('Content-Disposition');
      this.service.headers.delete('Content-Type');
    }
    // const headers = this.service.toLocalHeaders(this.service.headers);
  }

}
