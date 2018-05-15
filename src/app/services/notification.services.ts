import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Rx';

import { CommonService } from './common.services';
import { environment } from 'environments/environment';

/**
 * Base injection make notification.
 */
@Injectable()
export class NotificationsServices implements OnDestroy {

    public status$: Subject<any>;

    constructor() {

        this.status$ = new Subject();

    }

    ngOnDestroy() {

        this.status$.unsubscribe();

    }

    public makeNoticies(name: string): void {

        this.status$.next(name);

    }

}

/**
 * Make the upload signal and it will be caches by
 * `rxjs.Subject`.
 */
@Injectable()
export class UploadWsNotification implements OnDestroy {

    public percentage: any;
    public WSIO: WebSocket;
    public KEYWORD: string;

    constructor(private service: CommonService,
                public notifices: NotificationsServices) {
        this.KEYWORD = 'upload';
        this.notifices.status$.subscribe((data) => {

            if (data.toLowerCase() === this.KEYWORD) {

                let temp_url = `${environment.domainName}`;
                temp_url = `${temp_url}`;
                temp_url += '/ws/upload_status/?token=';
                temp_url += this.service.headers.get('Authorization').split(' ')[1];

                this.WSIO = new WebSocket(`${environment.ws_protocol}` + temp_url);

                const self = this;
                this.WSIO.addEventListener('open', function(event) {

                    console.log('Connection has been opened..');

                });
                this.WSIO.addEventListener('message', function(event) {
                    // console.log('Message from server ', event['data']);
                    self.percentage = event['data'];
                });

            }

        });
    }

    ngOnDestroy() {

        this.WSIO.addEventListener('close', function(event){});

    }

}

/**
 * Getting the user's details is async
 * as normal method
 * sometime causing unwanted problem.
 */
@Injectable()
export class AsynUserName implements OnDestroy {

    public KEYWORD: string;
    constructor(public notifices: NotificationsServices) {

        this.KEYWORD = 'userdetails';


    }

    /**
     * This method used to make callback of the given
     * function.
     */
    public makeCall(callback: () => void  ): void {
        this.notifices.status$.subscribe((data) => {

            if (data.toLowerCase() === this.KEYWORD) {

                callback();

            }

        });
    }

    ngOnDestroy() {
    }
}
