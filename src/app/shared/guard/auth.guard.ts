import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

import { CommonService } from '../../services/common.services';


@Injectable()
export class AuthGuard implements CanActivate {
    
    constructor(private router: Router,
                private service: CommonService) {}

    canActivate() {
    
        if (this.service.syncLocalStorage('isLoggedin') == 'true') {
    
            return true;
    
        }

        this.router.navigate(['/login']);
        return false;
    
    }

}
