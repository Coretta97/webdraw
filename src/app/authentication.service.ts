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
        if (!this.cookieService.check(this.user_session_key)) {
            return null;
        } else {
            const o = JSON.parse(this.cookieService.get(this.user_session_key));
            return new User(o['iduser'], o['username'], o['first_name'], o['last_name'], o['email'], o['password'], o['tel']);
        }
    }
    public isConnected(): boolean {
        return this.cookieService.check(this.user_session_key);
    }
    public login(user: User, duration: number = 0): void {


        this.cookieService.set(this.user_session_key, JSON.stringify({
            'iduser' : user.iduser,
            'username' : user.username,
            'first_name':  user.first_name,
            'last_name' : user.last_name,
            'email' : user.email,
            'password' : user.password,
            'tel' : user.tel
        }), duration, '/', 'localhost');
    }
    public logout(): void {
        this.cookieService.delete(this.user_session_key, '/', 'localhost');
    }


}
