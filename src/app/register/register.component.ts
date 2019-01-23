import {Component, OnInit} from '@angular/core';
import {NewUser} from '../models/NewUser';
import {RegisterService} from '../register.service';
import {User} from '../models/User';
import {AuthenticationService} from '../authentication.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    public user: NewUser;
    public errors = {
        username:  null,
        last_name: null,
        first_name: null,
        email: null,
        tel: null,
        password: null,
    };
    private usernames = [];
    private emails = [];

    constructor(private registerService: RegisterService, private authentificationService: AuthenticationService, private router: Router) {
        if (this.authentificationService.isConnected()) {
            this.router.navigateByUrl('/home');
        }

        this.user = new NewUser('', '', '', '', '', '');
        this.registerService.emailsUsernamesSaved().subscribe(res => {
            if (res['error']) {
              this.router.navigateByUrl('/register');
            } else {
                this.emails = res['emails'];
                this.usernames = res['usernames'];
            }
        });
    }
    validate(): boolean {
        let flag = true;
        if (this.user.username === '') {
            this.errors.username = 'Le pseudo est obligatoire';
            flag = false;
        } else if (this.usernames.includes(this.user.username)) {
            this.errors.username = 'Ce pseudo est déjà pris';
            flag = false;
        } else {
            this.errors.username = null;
        }
        if (this.user.last_name === '' ) {
            this.errors.last_name = 'Le nom est obligatoire';
            flag = false;
        } else {
            this.errors.last_name = null;
        }
        if (this.user.first_name === '') {
            this.errors.first_name = 'Le prénom est obligatoire';
            flag = false;
        } else {
            this.errors.first_name = null;
        }
        if (this.user.email === '') {
            this.errors.email = 'L\'email est obligatoire';
            flag = false;
        } else if (this.emails.includes(this.user.email)) {
            this.errors.email = 'Cet email est déjà prise';
            flag = false;
        } else {
            this.errors.email = null;
        }
        if (this.user.password === '') {
            this.errors.password = 'Le mot de passe est obligatoire';
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

    ngOnInit() {
    }

    register() {
        if (this.validate()) {
            this.registerService.register(this.user).subscribe(u => {
                if (u['error']) {
                    this.router.navigateByUrl('/register');
                } else {
                    const user = new User(u.iduser, u.username, u.first_name, u.last_name, u.email, u.password, u.tel);
                    this.authentificationService.login(user);
                    this.router.navigateByUrl('/home');
                }
            }, function () {
                console.log('Erreur de creation');
            });
        }
    }
}
