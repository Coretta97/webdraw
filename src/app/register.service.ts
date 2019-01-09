import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NewUser} from './models/NewUser';

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

    register(newUser: NewUser) {
        return this.http.post('/api/register', {
            last_name: newUser.last_name,
            first_name: newUser.first_name,
            email: newUser.email,
            password: newUser.password,
            tel: newUser.tel
        }, httpOptions);
    }
}
