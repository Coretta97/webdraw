import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {Router} from '@angular/router';
import {User} from '../models/User';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    public user: User;
    constructor(private authentificationService: AuthenticationService, private router: Router) {
        if (!this.authentificationService.isConnected()) {
            this.router.navigateByUrl('/login');
        }
        this.user = authentificationService.getUser();
    }

    ngOnInit() {
    }

}
