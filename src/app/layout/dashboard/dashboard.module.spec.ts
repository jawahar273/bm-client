import { DashboardModule } from './dashboard.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbCarouselModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';


describe('DashboardModule', () => {
  let dashboardModule: DashboardModule;
  let ngDataTable: NgxDatatableModule;
  let ngbTooltipModule: NgbTooltipModule;
  let ngbCarouselModule: NgbCarouselModule;

  beforeEach(() => {
    dashboardModule = new DashboardModule();
    ngbCarouselModule = new NgbCarouselModule();
    ngbTooltipModule = new NgbTooltipModule();
  });

  it('should create an instance', () => {
    expect(dashboardModule).toBeTruthy();
    expect(ngDataTable).toBeTruthy();
    expect(ngbCarouselModule).toBeTruthy();
    expect(ngbTooltipModule).toBeTruthy();
  });
});
