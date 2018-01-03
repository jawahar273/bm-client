import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-listed-items',
  templateUrl: './listed-items.component.html',
  styleUrls: ['./listed-items.component.scss'],
})
export class ListedItemsComponent implements OnInit {
  @Input('formGroupToList') public formGroupToList: any;
  @Input('count') public indx: number;

  constructor() { }

  ngOnInit() {
  }

}
