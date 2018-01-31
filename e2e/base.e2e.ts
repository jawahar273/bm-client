import { browser, by, element } from 'protractor';
import { Observable } from 'rxjs/Rx';

export class BaseAccessElement {
	getElementByCSS(name) {
		return element(by.css(name));
	}
	getElementByID(name) {
		return element(by.id(name));
	}

	getElementByTagName(name) {
		return element(by.tagName(name));
	}

	getElementByXpath(name) {
		return element(by.xpath(name));
	}

}
