import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {  Headers } from '@angular/http';

import { CommonService } from '../../services/common.services';
import { routerTransition } from '../../router.animations';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
  animations: [routerTransition()],
    encapsulation: ViewEncapsulation.None
})
export class EntryComponent implements OnInit {

    entryForm: FormGroup;
    itemEntry: Array<any> = [];
    hiddleAlert: boolean = true;
    entryFormAlert: Array<any> = [];
    hideLoadSpin: boolean = true;
    // entryFormGroupContents: Object;
    headers: Headers;
    id: number;
    serviceFields: Object;
    submitForm: boolean = false;
    content404: boolean = false;
    /**
     *
     * @param entryFormGroupBuilder
     * @param service
     * @param {ActivatedRoute} route using this object routing paramas can be obtain.
     *
     * @var {FormGroup} entryForm this is the link member between the html and JS and must
     *         be initilize for formgroup and form html.
     * @var {Object} serviceFields to convert the server and client fields in between sending & receving objects.
     * @var {Object} entryFormGroupContent a Object to contain the newly or object from the service formgroup.
     */
    constructor(public entryFormGroupBuilder: FormBuilder, public service: CommonService, public route: ActivatedRoute) {
        // @entryForm

      this.headers = this.service.headers;
      this.route.params.subscribe(params => { this.id = params['id']; });
      this.entryForm = this.entryFormGroupBuilder.group(this.getObjectForUpdate());
      !!this.id ? this.getOneItemListObject(this.id) : '';
        // const headers = new Headers({ 'Accept': 'application/json'});
        // this.service.get('package/itemslist/', headers).subscribe(
        //     (data) => {
        //         console.log(data);
        //     },
        //     (error) => {
        //         console.error(error);
        //     },
        // );
    //  this.entryForm.valueChanges.subscribe(form => { console.log(form); });
  }

  ngOnInit() {
      this.entryForm.get('entryGroupDate').setValue(this.service.today.toISOString().substring(0, 10));
      this.serviceFields = {
          entryGroupName: 'name',
          entryGroupPlace: 'place',
          entryGroupGroup: 'group',
          entryGroupDate: 'date',
          entryGroupItems: 'items'
      };
  }


  /**
   *
   * @param msg get the message for the error to display in the form alert
   * @param _type get the type of alert to be displayed
   */
  private showFormAlert( msg: string , _type: string = 'danger') {
      this.entryFormAlert = [];
     // this.entryFormAlert.push({type: _type, message: msg});
     this.service.showGlobalAlert(msg, _type);
  }

  /**
   *
   * @param {any} alert it is an object of the current alert.
   * @description used to close alert in display.
   */
  public closeAlert(alert?: Object, removeAll?: boolean ) {
      // if (removeAll) {
      //     this.entryFormAlert = [];
      // } else {
      //     const index: number = this.entryFormAlert.indexOf(alert);
      //     this.entryFormAlert.splice(index, 1);
      // }
      this.service.closeGlobalAlert(alert, removeAll);
  }
  /**
   *
   * @param id unique id of the entry which is from back-end.
   */
  private getOneItemListObject(id: any): any {
      const _self = this;
      this.service.get(`package/itemslist/${id}`, this.headers)
       .subscribe(
         (_object) => {
             const entryFormGroupContents = this.getObjectForUpdate(_object);
             this.entryForm = this.entryFormGroupBuilder.group(entryFormGroupContents);
             this.content404 = false;
          },
          (error) => {
            //   if (error.status )
              const msg = this.service.isClinetOrServerSidesError(error);
              this.showFormAlert(`the List is ${msg} in the server.`);
              this.entryForm = this.entryFormGroupBuilder.group(this.getObjectForUpdate());
              this.content404 = true;
      });
  }

/**
 *
 * @param _object Object from the response api.
 * @return {Object}  for createing dymanic based on the request data
 */
  private getObjectForUpdate(_object?: Object): Object {
      const temp = !!_object ? this.generateListOfItems(_object['items']) : [this.generateGroupItemsFormControl()];
      const _return =  {
          entryGroupName: [!!_object ? _object['name'] : '', Validators.required],
          entryGroupPlace: [!!_object ? _object['place'] : '', Validators.required],
          entryGroupGroup: [!!_object ? _object['group'] : '', Validators.required],
          entryGroupDate: [!!_object ? _object['date'] : '', Validators.required],
          entryGroupItems: this.entryFormGroupBuilder.array(temp)
        //   Validators.compose([Validators.required, Validators.minLength(7)])
      };
      return _return;
  }

  private generateListOfItems(items): Array<FormGroup> {
      let pushArray = [];
      Object.keys(items).forEach((element, index) => {
          const temp = this.generateGroupItemsFormControl(items[element]['amount'], items[element]['name'] );
          pushArray.push(temp);
      });
      return pushArray;
  }

  private generateGroupItemsFormControl(value?: string, name?: string): FormGroup {
     value =  !!value ? value : '';
     name = !!name ? name : '';
     const temp = {
         amount: [value, Validators.compose([Validators.required])],
         name: [name, Validators.compose([Validators.required])],
     };
      return this.entryFormGroupBuilder.group(temp);
  }

  /**
   *
   * @param name get the formcontrol's name
   * @return {boolean}
   * @description check the form is valid or not
   */
  public checkFormHasError(name: string): boolean {
      return this.service.checkFormHasError(name, this.entryForm);
  }

  /**
   *
   * @description add the form field.
   */
  public addItem() {
      (<FormArray>this.entryForm.controls['entryGroupItems']).push(this.generateGroupItemsFormControl());
  }

  public deleteItem(index) {
    if (index > 0) {
        (<FormArray>this.entryForm.controls['entryGroupItems']).removeAt(index);
    }
  }

  public trackByFnForEntryGroupItems(index, item) { 
      return item.id; 
  }
  /**
   *
   * @return {void}
   * @description this function is called on the event `onsubmit`.
   */
  public entrySubmit(): void {
    if (this.entryForm.valid && this.submitForm) {
        // entryFormAlert
        this.hideLoadingSpin(false);
        const url = 'package/itemslist';
        const oldName = Object.keys(this.serviceFields);
        const newName = Object.values(this.serviceFields);
        let _body = this.service.renameObjectAllKeys(oldName, newName, this.entryForm.value);
        _body = JSON.stringify(_body);
        if (!!this.id && !this.content404) {
            this.service.update(url + `/${this.id}`, this.headers,  _body)
              .subscribe(
                  (data) => {
                      this.showFormAlert('Content Updated', 'success');
                      this.hideLoadingSpin(true);
                      this.service.needTableUpdate = true;
                      this.service.needChartUpdate = true;
                    //   this.service.requireUpdate['entry'] = true;
                  },
                  (error) => {
                      const msg = this.service.isClinetOrServerSidesError(error);
                      this.showFormAlert(msg, 'danger' );
                      this.hideLoadingSpin(false);
                  }
              );
        } else {
            this.service.post(url, this.headers, _body)
              .subscribe(
                  (data) => {
                      console.log(data);
                      this.showFormAlert('Content Created', 'success');
                      this.hideLoadingSpin(true);
                      this.service.needTableUpdate = true;
                      this.service.needChartUpdate = true;
                      
                    //   this.service.requireUpdate['entry'] = true;
                  },
                  (error) => {
                    //   this.showFormAlert(error, 'danger');
                      this.hideLoadingSpin(false);
                      const msg = this.service.isClinetOrServerSidesError(error);
                      this.showFormAlert(msg, 'danger');
                  });
        }
    } else if (this.submitForm) {
        this.hideLoadingSpin(true);
        this.showFormAlert(`Error in the form value: ${this.findInvalidControls()} `);
    } else {
        this.hideLoadingSpin(true);
    }
    this.submitForm = false;
 }

 public getEntryGroupItemsControl() {
   return (<FormArray>this.entryForm.get('entryGroupItems')).controls;
 }

 private hideLoadingSpin(condition: boolean): void {
     this.hideLoadSpin = condition;
 }

 public findInvalidControls(checkAllFields: boolean = false) {
     let invalid = [];
     const controls = this.entryForm.controls;
     const _names = Object.keys(controls);
     const inx = _names.indexOf('entryGroupItems');
     _names.splice(inx, 1);
     // check for the formcontrol under `entryForm`.
     for (const name of _names) {
         if (controls[name].invalid) {
             controls[name].markAsTouched({onlySelf: true});
            if (!checkAllFields) {
                return name;
            } else if (checkAllFields) {
                invalid.push(name);
            }
         }
     }
     // check for the formcontrol under form array `entryGroupItems`
     if (controls['entryGroupItems'].invalid) {
         controls.entryGroupItems['controls'].forEach((element, index) => {
            //  element.invalid ? element.markAsTouched({ onlySelf: true }) : undefined;
             const amount = element.controls['amount'];
             const name = element.controls['name'];
             amount.invalid ? amount.markAsTouched({ onlySelf: true }) : undefined;
             name.invalid ? name.markAsTouched({ onlySelf: true }) : undefined;
         });
        //  return invalid;
     }
     return invalid;
 }

}
