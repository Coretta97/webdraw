import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from './authentication.service';


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
export class FilesService {

    constructor(private http: HttpClient, private authentificationService: AuthenticationService) {
    }

    files(): Observable<object> {
        return this.http.get('/api/files/' + (this.authentificationService.getUser().iduser), httpOptions);
    }
}
