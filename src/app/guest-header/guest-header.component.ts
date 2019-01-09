import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-guest-header',
    templateUrl: './guest-header.component.html',
    styleUrls: ['./guest-header.component.scss']
})
export class GuestHeaderComponent implements OnInit {
    @Input() active: string;
    constructor() {
    }

    ngOnInit() {
    }

}
