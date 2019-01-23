import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {User} from './models/User';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private user_session_key = 'user';
    constructor(private cookieService: CookieService) {
    }
    public getUser(): User {
        if (this.cookieService.check(this.user_session_key)) {
            return null;
        } else {
            return JSON.parse(this.cookieService.get(this.user_session_key));
        }
    }
    public isConnected(): boolean {
        return this.cookieService.check(this.user_session_key);
    }
    public login(user: User, duration: number = 0): void {
        this.cookieService.set(this.user_session_key, JSON.stringify(user), duration);
    }
    public logout(): void {
        this.cookieService.delete(this.user_session_key);
    }


}
