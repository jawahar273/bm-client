
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';
import * as io from 'socket.io-client';

import { CommonService } from './common.services';
import { environment } from 'environments/environment';


@Injectable()
export class NotificationsServices {
    public status$: Subject<any>;

    constructor() {

        this.status$ = new Subject();

    }

    public makeNoticies(name: string): void {

        this.status$.next(name);

    }

}

@Injectable()
export class UploadWsNotification {
    public percentage: any;
    public WSIO: io;

    constructor(private service: CommonService,
                public notifices: NotificationsServices) {
        notifices.status$.subscribe((data) => {

            if (data.toLowerCase() === 'upload') {

                let temp_url = `${environment.domainName}`;
                temp_url = `${environment.ws_protocol}${temp_url}`;
                temp_url += '/ws/upload_status/?token=';
                temp_url += this.service.headers.get('Authorization').split(' ')[1];

                const ws = new WebSocket(temp_url);
                ws.addEventListener('open', function(event) {
                    console.log(event);
                });
                ws.addEventListener('message', function (event) {
                    console.log('Message from server ', event);
                });

            }

        });
    }

}