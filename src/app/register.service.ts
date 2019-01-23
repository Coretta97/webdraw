import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NewUser} from './models/NewUser';
import {User} from './models/User';
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


export class RegisterService {

    constructor(private http: HttpClient) {
    }

    register(newUser: NewUser): Observable<User> {
        return this.http.post<User>('/api/create-user', {
            username: newUser.username,
            last_name: newUser.last_name,
            first_name: newUser.first_name,
            email: newUser.email,
            password: newUser.password,
            tel: newUser.tel
        }, httpOptions);
    }

    emailsUsernamesSaved(): Observable<object> {
        return this.http.get<object>('/api/emails-usernames', httpOptions);
    }
}
