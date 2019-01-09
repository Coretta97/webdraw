import {Component, OnInit} from '@angular/core';
import {Guest} from '../models/Guest';
import {LoginService} from '../login.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    public guest: Guest;

    constructor(private loginService: LoginService) {
        this.guest = new Guest('', '');
    }

    login() {
        // TODO : A complété
        this.loginService.login(this.guest);
    }

    ngOnInit() {
    }

}
