import {Component, OnInit} from '@angular/core';
import {NewUser} from '../models/NewUser';
import {RegisterService} from '../register.service';
import {User} from '../models/User';
import {CookieService} from 'ngx-cookie-service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    public user: NewUser;

    constructor(private registerService: RegisterService, private cookieService: CookieService) {
        this.user = new NewUser('', '', '', '', '', '');
        this.cookieService.delete('user');
    }

    ngOnInit() {
    }

    register() {
        // TODO : A complété
        this.registerService.register(this.user).subscribe(u => {
            const user = new User(u.iduser, u.username, u.first_name, u.last_name, u.email, u.password, u.tel);
            this.cookieService.set('user', JSON.stringify(user));
        }, function () {
            console.log('Erreur de creation');
        });
    }
}
