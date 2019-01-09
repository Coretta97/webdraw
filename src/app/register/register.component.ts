import {Component, OnInit} from '@angular/core';
import {NewUser} from '../models/NewUser';
import {RegisterService} from '../register.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    public user: NewUser;

    constructor(private registerService: RegisterService) {
        this.user = new NewUser('', '', '', '', '');
    }

    ngOnInit() {
    }

    register() {
        // TODO : A complété
        this.registerService.register(this.user);
    }

}
