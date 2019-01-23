import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss']
})

export class EditorComponent implements OnInit {

    constructor(private authentificationService: AuthenticationService, private router: Router) {
        if (!this.authentificationService.isConnected()) {
            this.router.navigateByUrl('/login');
        }
    }

    ngOnInit() {
    }

}
