
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';
import io from 'socket.io-client';

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

    constructor(notifices: NotificationsServices) {

        notifices.status$.subscribe((data) => {

            if (data.toLowerCase() == 'upload') {
                let temp_url = `${environment.domainName}/${environment.apiPath}`
                temp_url = `${environment.ws_protocol}${temp_url}`
                temp_url += '/ws/upload_status/'
                this.WSIO = io(temp_url);
                this.WSIO.on('connect', () => {
               
                    console.log(this.WSIO.id);
               
                });

            }

        });
    }

}