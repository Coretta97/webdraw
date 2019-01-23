import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-user-header',
    templateUrl: './user-header.component.html',
    styleUrls: ['./user-header.component.scss']
})
export class UserHeaderComponent implements OnInit {

    @Input() active: string;

    constructor() {
    }

    ngOnInit() {
    }

}
