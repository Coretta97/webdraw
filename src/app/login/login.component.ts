import {Component, OnInit} from '@angular/core';
import {Guest} from '../models/Guest';
import {LoginService} from '../login.service';
import {CookieService} from 'ngx-cookie-service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    public guest: Guest;

    constructor(private loginService: LoginService, private cookieService: CookieService) {
        this.guest = new Guest('', '');
        this.cookieService.delete('user');
    }

    login() {
        // TODO : A complété
        this.loginService.login(this.guest);
    }

    ngOnInit() {
    }

}
