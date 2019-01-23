import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(private authentificationService: AuthenticationService, private router: Router) {
      if (this.authentificationService.isConnected()) {
          this.router.navigateByUrl('/home');
      }
  }

  ngOnInit() {
  }

}
