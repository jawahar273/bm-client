import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {  Headers } from '@angular/http';

import { CommonService } from '../../services/common.services';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {

    entryForm: FormGroup;
    itemEntry: Array<any> = [];
    today: Date;
    hiddleAlert: boolean = true;
    entryFormAlert: Array<any> = [];
    hideLoadSpin: boolean = true;
    entryFormGroupContents: Object;
    headers: Headers;

    // @Input() isUpdateFields: boolean = false;
    // @Input() entryFormGroupContents: Object = undefined;
    constructor(public entryFormGroup: FormBuilder, public service: CommonService, public route: ActivatedRoute) {
      this.headers = new Headers({ 'Accept': 'application/json' });
      let id: number;
      this.route.params.subscribe(params => { id = params['id']; });
      this.entryFormGroupContents = !!id ? this.getOneItemListObject(id) : undefined;
      this.entryFormGroupContents = this.getObjectForUpdate();
        // const headers = new Headers({ 'Accept': 'application/json'});
        // this.service.get('package/itemslist/', headers).subscribe(
        //     (data) => {
        //         console.log(data);
        //     },
        //     (error) => {
        //         console.error(error);
        //     },
        // );
  }

  ngOnInit() {
     this.entryForm = this.entryFormGroup.group(this.entryFormGroupContents);
     this.today = new Date();
     this.entryForm.get('entryGroupDate').setValue(this.today.toISOString().substring(0, 10));
    //  this.entryForm.valueChanges.subscribe(form => { console.log(form); });
  }

  /**
   *
   * @param msg get the message for the error to display in the form alert 
   * @param _type get the type of alert to be displayed
   */
  private showFormErrorOnAlert( msg: string , _type: string = 'danger') {
     this.entryFormAlert.push({type: _type, message: msg});
  }


  private getOneItemListObject(id: any): any {
      const _self = this;
      this.service.get(`package/itemslist/${id}`, this.headers).subscribe((_object) => {
          this.entryFormGroupContents = this.getObjectForUpdate(_object);
          this.entryForm = this.entryFormGroup.group(this.entryFormGroupContents);
          },
          (error) => {
            //   if (error.status )
              const msg = this.service.isClinetOrServerSidesError(error);
              this.showFormErrorOnAlert(msg);
              return undefined;
          });
  }

/**
 *
 * @param _object Object from the response api.
 * @return {Object} object for createing dymanic based on the request data
 */
  private getObjectForUpdate(_object?: Object): Object {
      const temp = !!_object ? this.generateListOfItems(_object['items']) : [this.generateGroupItemsFormControl()];
      return {
          entryGroupName: [!!_object ? _object['name'] : '', Validators.required],
          entryGroupPlace: [!!_object ? _object['place'] : '', Validators.required],
          entryGroupGroup: [!!_object ? _object['group'] : '', Validators.required],
          entryGroupDate: [!!_object ? _object['date'] : '', Validators.required],
          entryGroupItems: this.entryFormGroup.array(temp)
        //   Validators.compose([Validators.required, Validators.minLength(7)])
      };
  }

  private generateGroupItemsFormControl(value?: string): FormGroup {
     value =  !!value ? value : '' ;
     return this.entryFormGroup.group({ amount: [value] });
  }

  private generateListOfItems(items): Array<FormGroup> {
      let pushArray = [];
      Object.keys(items).forEach((element, index) => {
          pushArray.push(this.generateGroupItemsFormControl(items[element]['amount']));
      });
      return pushArray;
  }


  /**
   * @param {any} alert it is an object of the current alert.
   * @description used to close alert in display.
   */
  public closeAlert(alert: any) {
        const index: number = this.entryFormAlert.indexOf(alert);
        this.entryFormAlert.splice(index, 1);
  }

  /**
   * @param name get the formcontrol's name
   * @return {boolean}
   * @description check the form is valid or not
   */
  private checkFormHasError(name: string): boolean {
      const temp = this.entryForm.get(name);
      return (!temp.valid && temp.touched);
  }

  /**
   * @description add the form field.
   */
  public addItem() {
      (<FormArray>this.entryForm.controls['entryGroupItems']).push(this.generateGroupItemsFormControl());
  }

  public delectItem(index) {
    if (index > 0) {
        (<FormArray>this.entryForm.controls['entryGroupItems']).removeAt(index);
    }
  }

  private entrySubmit() {
    if (this.entryForm.valid) {
        // entryFormAlert
        this.hideLoadingSpin(false);
        const url = 'package/itemslist/';
        let serviceMethod = (!!this.entryFormGroupContents ?
            this.service.update(url + this.entryFormGroupContents['id'], this.headers, JSON.parse(this.entryForm.value)).subscribe(() => { }, (error) => { this.entryFormAlert.push({ type: 'danger', message: error })}) :
            this.service.post(url, this.headers, JSON.parse(this.entryForm.value)).subscribe((data) => { }, (error) => { this.entryFormAlert.push({ type: 'danger', message: error })})
                            );
    } else {
        this.hideLoadingSpin(true);
        this.showFormErrorOnAlert(`Error in the form value: ${this.findInvalidControls()} `);
    }
 }

 private hideLoadingSpin(condition: boolean): void {
     this.hideLoadSpin = condition;
 }

 public findInvalidControls() {
     const invalid = [];
     const controls = this.entryForm.controls;
     for (const name in controls) {
         if (controls[name].invalid) {
             invalid.push(name);
         }
     }
     return invalid;
 }

}
