import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

import { PageHeaderModule } from '../../shared';
import { EntryRoutingModule } from './entry-routing.module';

import { EntryComponent } from './entry.component';
import { ListedItemsModule } from './listed-items/listed-items.module';
import { ListedItemsComponent } from './listed-items/listed-items.component';
// import { EntryComponent } from './entry.component';

describe('EntryComponent', () => {
  let component: EntryComponent;
  let fixture: ComponentFixture<EntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({

      declarations: [ EntryComponent ],
      imports: [PageHeaderModule,
      ReactiveFormsModule, NgbModule,
      ListedItemsModule]
      
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // it('', () => {
  // });

});
