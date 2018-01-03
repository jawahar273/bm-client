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
      this.headers = new Headers({ 'Accept': 'application / json' });
      let id: number;
      this.route.params.subscribe(params => { id = params['id']; });
      this.entryFormGroupContents = !!id ? this.getOneItemListObject(id) : undefined;
      this.entryFormGroupContents = !!this.entryFormGroupContents ? this.getObjectForUpdate(this.entryFormGroupContents)
           : this.getObjectForUpdate();
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

  private getOneItemListObject(id: any): Object {
      return this.service.get(`package/itemslist/${id}`, this.headers);
  }

  /**
   *
   * @param {any} alert it is an object of the current alert.
   * @description used to close alert in display.
   */
  public closeAlert(alert: any) {
        const index: number = this.entryFormAlert.indexOf(alert);
        this.entryFormAlert.splice(index, 1);
  }
  /**
   * @description add the form field.
   */
  public addItem() {
      (<FormArray>this.entryForm.controls['entryGroupItems']).push(new FormControl('', Validators.required));
  }

  public delectItem(index) {
    if (index > 0) {
        (<FormArray>this.entryForm.controls['entryGroupItems']).removeAt(index);
    }
  }

  private entrySubmit() {
    if (this.entryForm.valid) {
        // entryFormAlert
        this.loadingSpin(true);
        const url = 'package/itemslist/';
        let serviceMethod = (!!this.entryFormGroupContents ?
            this.service.update(url + this.entryFormGroupContents['id'], this.headers, JSON.parse(this.entryForm.value)).subscribe(() => { }, (error) => { this.entryFormAlert.push({ type: 'danger', message: error })}) :
            this.service.post(url, this.headers, JSON.parse(this.entryForm.value)).subscribe((data) => { }, (error) => { this.entryFormAlert.push({ type: 'danger', message: error })})
                            );
    } else {
        this.loadingSpin(false);
        this.entryFormAlert.push({
            type: 'danger',
            message: 'Error in the form value.'
        });
    }
 }

 private loadingSpin(condition: boolean): void {
     this.hideLoadSpin = condition;
 }
/**
 *
 * @param _object Object from the response api.
 * @return {Object} object for createing dymanic based on the request data
 */
 private getObjectForUpdate(_object?: Object): Object {
     const temp = [!!_object ? this.generateListOfItems(_object['items']) : new FormControl('', Validators.required)];
     return {
         entryGroupName: [!!_object ? _object['name'] : '', Validators.required],
         entryGroupPlace: [!!_object ? _object['place'] : '', Validators.required],
         entryGroupGroup: [!!_object ? _object['group'] : '', Validators.required],
         entryGroupDate: [!!_object ? _object['date'] : '', Validators.required],
         entryGroupItems: this.entryFormGroup.array(temp)
     };
 }

 private generateListOfItems(items): Array<FormControl> {
     let pushArray: Array<FormControl>;
   Object.keys(items).forEach((element, index) => {
       pushArray.push(new FormControl(items[element]));
   });
   return pushArray;
 }

}
