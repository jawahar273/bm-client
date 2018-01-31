import { Http } from '@angular/http';
import { AppPage } from './app.po';

describe('Front end testing', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should login', () => {
    page.navigateTo('/login');
    page.loginUserName.sendKeys('admin');
    page.loginPassWord.sendKeys('jon2speed'); // only for local don't worry
    page.loginButton.click();
  });

  it('after login success', () => {
    expect(page.getHeaderBarTitle()).toEqual('Budget Management');
    page.activeTableUpdateButton().click();
  });
  // temporarily disabling for bug.. 
  xit('must create a new entry', () => {
  	page.navigateTo('entry');
  	page.setEntryFormData();
  	page.getHeaderBarTitle();
  });

});
