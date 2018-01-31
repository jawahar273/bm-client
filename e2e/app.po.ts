import { browser,  } from 'protractor';
import { Http, Response } from '@angular/http';

import { BaseAccessElement } from './base.e2e';
import { EntryFormData } from './test-entry-form-data'; 

export class AppPage extends BaseAccessElement {
  	 loginUserName = this.getElement('loginPassName', 'id');
  	 loginPassWord = this.getElement('loginPassword', 'id');
  	 loginButton = this.getElement('loginButton', 'id');
  constructor(public http?: Http) {
  	super()
  }
  navigateTo(path='/') {
    return browser.get(path);
  }
  /**
  * get the title
  */
  getTitle() {
    return this.getElement('title', 'tag').getText();
  }
  /**
  * get the header bar in dashboard
  */
  getHeaderBarTitle() {
  	return this.getElement('nav > a', 'css').getText();
  }
  /**
  * update button in dashboard
  */
  activeTableUpdateButton() {
  	return this.getElement('.card-header button.btn.btn-xs.app-button', 'css');
  }

  getElement(name, by) {
  	switch (by) {
  		case "css":
  			return this.getElementByCSS(name);
   		case "id":
  			return this.getElementByID(name);
  		case "tag":
  			return this.getElementByTagName(name);		
  		case "xpath":
  			return this.getElementByXpath(name);
  	}
  }

  setEntryFormData() {
  	    const data = EntryFormData['data'];
  	    // const accessType = data['elementType'];
  	  	for (const subData in data) {
  	  		// if ('entryGroupItems' in key) {
  	  		// 	const self = this;
  	  		// 	data['entryGroupItems'].forEach((key, index) => {
  	  		// 		const hint = `entryGroupItemsHint-${index}`;
  	  		// 		const amount = `entryGroupItemsAmount-${index}`;
  	  		// 		self.getElement(hint, 'id').sendKeys(key[hint])
  	  		// 		self.getElement(amount, 'id').sendKeys(key[amount])
  	  		// 	});
  	  		// } else {
  	  		// 	this.getElement(key, 'id').sendKeys(data[key]);
  	  		// }
  	  		this.getElement('groupName', 'id').sendKeys(subData['groupName']);
  	  		this.getElement('groupPlace', 'id').sendKeys(subData['groupPlace']);
  	  		this.getElement('groupCategory', 'id').sendKeys(subData['groupCategory']);
	 		this.getElement('groupDate', 'id').sendKeys(subData['groupDate']);
  	  		const self = this;
  	  		subData['entryGroupItems'].forEach((key, index) => {
  	  			const hint = `entryGroupItemsHint-${index}`;
  	  			const amount = `entryGroupItemsAmount-${index}`;
  	  			self.getElement(hint, 'id').sendKeys(key[hint])
  	  			self.getElement(amount, 'id').sendKeys(key[amount])
  	  		});
  	  	}

  	  	this.getElement('button.btn.app-button.form-group.right', 'css').click();
  	  	this.navigateTo('/dashboard');
  	  	browser.sleep(5000);
   }
}
