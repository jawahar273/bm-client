import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageSettingsComponent } from './package-settings.component';

describe('PackageSettingsComponent', () => {
  let component: PackageSettingsComponent;
  let fixture: ComponentFixture<PackageSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
