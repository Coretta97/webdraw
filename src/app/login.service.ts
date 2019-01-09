import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Guest} from './models/Guest';

const httpOptions = {
    headers: new HttpHeaders({
        'Access-control-Allow-Origin': '*',
        'Access-Control-Methods': 'GET, POST, DELETE, PUT',
        'Access-Control-Headers': 'Origin, X-requested-With, Content-Type, Accept, Authorization'
    })
};


@Injectable({
    providedIn: 'root'
})

export class LoginService {

    constructor(private http: HttpClient) {
    }

    validateLogin(guest: Guest) {
        return this.http.post('/api/login', {
            email: guest.email,
            password: guest.password
        }, httpOptions);
    }

}
