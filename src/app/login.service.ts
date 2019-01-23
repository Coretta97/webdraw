import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Guest} from './models/Guest';
import {Observable} from 'rxjs';

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

    login(guest: Guest): Observable<object> {
        return this.http.post<object>('/api/login', {
            email: guest.email,
            password: guest.password
        }, httpOptions);
    }

}
