import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../authentication.service';
import {User} from '../models/User';

@Component({
    selector: 'app-user-header',
    templateUrl: './user-header.component.html',
    styleUrls: ['./user-header.component.scss']
})
export class UserHeaderComponent implements OnInit {

    @Input() active: string;
    @Input() user: User;

    constructor(private router: Router, private authentificationService: AuthenticationService) {
    }

    ngOnInit() {
    }

    disconnect() {
        this.authentificationService.logout();
        this.router.navigateByUrl('/login');
    }

}
