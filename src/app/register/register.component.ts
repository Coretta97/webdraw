import {Component, OnInit} from '@angular/core';
import {NewUser} from '../models/NewUser';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    public user: NewUser;

    constructor() {
        this.user = new NewUser('', '', '', '', '');
    }

    ngOnInit() {
    }

    register() {

    }

}
