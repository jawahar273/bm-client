import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-listed-items',
  templateUrl: './listed-items.component.html',
  styleUrls: ['./listed-items.component.scss'],
})
export class ListedItemsComponent implements OnInit {
  @Input('formGroupToList') public formGroupToList: any;
  @Input('count') public indx: number;
  @Output() public addItemList = new EventEmitter();
  @Output() public deleteItemList = new EventEmitter<number>();


  constructor() {
  }

  ngOnInit() {
  }

  checkFormError(name: string): void {
    // console.log('dfdf');
    // this.checkFormErrorItemsFunc.emit({ name: name, index: this.indx});
    const temp = this.formGroupToList.get(name);
    return (temp.invalid && temp.touched);
  }

  public addItem() {
    this.addItemList.emit();
  }

  public deleteItem(index: number) {
    this.deleteItemList.emit(index);
  }

}
