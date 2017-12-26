import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';


@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {

  	entryForm: FormGroup;
  	itemEntry: any =[];
  	today: Date
  constructor(public entryFormGroup: FormBuilder) { 
  	this.entryForm = entryFormGroup.group({
  		entryGroupName: "",
  		entryGroupPlace: "",
  		entryGroupGroup: "",
  		entryGroupDate: "",
  		entryGroupItems: entryFormGroup.array([ this.listItems() ])
  	});
  	this.today = new Date();
  	this.entryForm.get('entryGroupDate').setValue(this.today.toISOString().substring(0,10));
  }

  ngOnInit() {
  }

  listItems(): FormGroup {
  	return this.entryFormGroup.group({
  		entryGroupItemName: "",
  		entryGroupAmount: ""
  	})
  }
}
