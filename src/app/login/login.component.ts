import {Component, OnInit} from '@angular/core';
import {Guest} from '../models/Guest';
import {LoginService} from '../login.service';
import {AuthenticationService} from '../authentication.service';
import {Router} from '@angular/router';
import {User} from '../models/User';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    public guest: Guest;
    public errors = {
        email : null,
        password : null,
        auth_info : false
    };

    constructor(private loginService: LoginService, private authentificationService: AuthenticationService, private router: Router) {
        if (this.authentificationService.isConnected()) {
            this.router.navigateByUrl('/home');
        }

        this.guest = new Guest('', '');
    }

    validate(): boolean {
        let flag = true;
        if (this.guest.email === '') {
            this.errors.email = 'Champ obligatoire';
            flag = false;
        } else {
            this.errors.email = null;
        }
        if (this.guest.password === '' ) {
            this.errors.password = 'Champ obligatoire';
            flag = false;
        } else {
            this.errors.password = null;
        }
        if (flag) {
            return true;
        } else {
            return false;
        }
    }

    login() {
        // TODO : A complété
        if (this.validate()) {
            this.loginService.login(this.guest).subscribe(u => {
                if (u['error']) {
                    this.router.navigateByUrl('/login');
                } else if (u['auth-error']) {
                    this.errors.auth_info = true;
                } else {
                    const user = new User(u['iduser'], u['username'], u['first_name'], u['last_name'], u['email'], u['password'], u['tel']);
                    this.authentificationService.login(user);
                    this.router.navigateByUrl('/home');
                }
            });
        }
    }

    ngOnInit() {
    }

}
