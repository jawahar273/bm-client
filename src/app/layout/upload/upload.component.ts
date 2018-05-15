import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Headers } from '@angular/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import io from 'socket.io-client';

import { CommonService } from '../../services/common.services';
import { routerTransition } from '../../router.animations';
import { NotificationsServices } from '../../services/notification.services';

// config from  ts.config.json
import { environment } from 'environments/environment';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  animations: [routerTransition()],
  encapsulation: ViewEncapsulation.None
})
export class UploadComponent implements OnInit {
  // public uploadForm: FormGroup;
  public flagForUpload: Object;
  public flagMsg: string;
  public flagForUploadBtn: Boolean;
  public entryOptionTypes: Array<Object>;
  public defaultEntryOptionType: string;
  public fileObject: any;
  public uploadTermsAndCondtions: Object;
  public closeResult: string;
  public spinnerIcon: Boolean;

  constructor(public service: CommonService,
              private modalService: NgbModal,
              public notifices: NotificationsServices) { 

    this.flagForUpload = {
      'entryType': false,
      'entryFile': false,
      'entryDummpy': false,
    };

    this.flagMsg = '';
    this.flagForUploadBtn = false;

    this.entryOptionTypes = [
      { value: 'default', name: 'None' }, // this should the first one
      { value: 'paytm', name: 'Paytm' },
      { value: 'other', name: 'Other' },
    ];

    this.defaultEntryOptionType = 'default';
    this.spinnerIcon = true;
    // this.ioSocket = io(temp_url);
    this.getUploadTermsCondtions();

  }

  ngOnInit() {
    // for testing only
         // this.notifices.makeNoticies('upload');
  }

  public setLoadSpinner(value: Boolean): void {

    this.spinnerIcon = value;

  }

  public open(content) {

    this.modalService.open(content).result.then((result) => {

      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {

      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

    });

  }

  private getDismissReason(reason: any): string {

    if (reason === ModalDismissReasons.ESC) {

      return 'by pressing ESC';

    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {

      return 'by clicking on a backdrop';

    } else {

      return  `with: ${reason}`;

    }

  }

  public getKeys(data: Object): Array<any> {
    if (!data) {
      return ['error in server'];
    }
    return Object.keys(data);

  }

  private getUploadTermsCondtions(): void {

    this.service.localStorage.getItem('upload-terms-condtions')
     .subscribe((data) => {

       if (!data) {

         this.service.get('package/upload-term-condition', this.service.headers)
          .subscribe((data) => {

              this.uploadTermsAndCondtions = data['detail'];
              this.service.localStorage.setItem('upload-term-condition', data)
              .subscribe((data)=>{});

          }, (error) => {

          });

       } else {

         this.uploadTermsAndCondtions = data;

       }

     });

  }

  public onChangEntryType(event): void {

    this.setFlagVar({name: 'entryDummy', value: false})

  }

  private setFlagVar(
     {name, value, msg, msgType}:
     {name: string, value: Boolean, msg?: string, msgType?: string} = {name: '', value: null}
    ): void {

    // refer : https://jawahar273.gitbooks.io/blog/content/Typescript/
    this.flagForUpload[name] = value;
    this.flagForUploadBtn = value;


    if (msg) {

      msgType = !msgType ? 'danger' : msgType;
      this.service.showGlobalAlert(msg, msgType);

    }

  }

  public onChangeFile(event) {

    const file = event.srcElement.files[0];
    this.setFlagVar({name: 'entryFile', value: false});
    if (!(file.name.endsWith('.csv') || file.name.endsWith('.xlxs'))) {

       const msg = 'It is highly recommented to use MS-Excel 2007+/CSV only';
       this.setFlagVar({name: 'entryFile', value: true, msg: msg});

    }

    if (file.size > 262144) {

       const msg = 'Huge file size(equal or about of 2 MB) is not allowed.';
       this.setFlagVar({name: 'entryFile', value: true, msg: msg});

    }

    this.fileObject = file;

  }

  public onSubmitUploadFile(value: any) {

    if (value['entryType'] === 'default') {

      const msg = 'upload type `None` is not allowed. Please choose other options'
      this.setFlagVar({name: 'entryType', value: true, msg: msg});

    } else {

      this.setLoadSpinner(false);
      let url = 'package/upload';

      if (value['entryType'] === 'paytm') {

        url = 'package/paytm-upload';

      } else {

        url = 'package/upload';

      }

      this.service.headers.append('Content-Disposition', `form-data; filename=${this.fileObject.name}`);
      this.service.headers.set('Content-Type', `${this.fileObject.type}`);
      this.service.post(`${url}/${this.fileObject.name}`, this.service.headers, value)
       .subscribe((data) => {

         this.service.showGlobalAlert('File has been uploaded.', 'success');
         this.setLoadSpinner(false);
         // make notifications
         this.notifices.makeNoticies('upload');

       }, (error) => {

         const msg = this.service.isClinetOrServerSidesError(error);
         this.service.showGlobalAlert(msg);
         this.setLoadSpinner(false);

       });
      //  resetting the header for api call.
      this.service.headers.delete('Content-Disposition');
      this.service.headers.set('Content-Type', 'application/json');

    }
    // const headers = this.service.toLocalHeaders(this.service.headers);
  }

}
