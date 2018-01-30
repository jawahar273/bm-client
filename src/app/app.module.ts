import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';


import { ServiceWorkerModule } from '@angular/service-worker';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AsyncLocalStorageModule } from 'angular-async-local-storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { environment } from '../environments/environment';

import { CommonService } from './services/common.services';


// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
    // for development
    // return new TranslateHttpLoader(http, '/start-angular/SB-Admin-BS4-Angular-5/master/dist/assets/i18n/', '.json');
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        AppRoutingModule,
        NgbModule.forRoot(),
        // if you add diffrent base href pls update with relative path at font..
        // this might be bug and has been reposted 
        // https://github.com/angular/angular-cli/issues/9406 and https://github.com/angular/angular-cli/issues/8515
        // environment.production ? ServiceWorkerModule.register('/bm-client/ngsw-worker.js') : [],
        ServiceWorkerModule.register('/bm-client/ngsw-worker.js', {
           enabled: environment.production
        }),
        AsyncLocalStorageModule,
    ],
    declarations: [AppComponent],
    providers: [AuthGuard, CommonService],
    bootstrap: [AppComponent],
})
export class AppModule {}
