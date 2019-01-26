import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from './authentication.service';
import {File} from './models/File';


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

    save(file: File): Observable<object> {
        return this.http.post('/api/save-file', {
            idfile : file.idfile,
            name : file.name,
            content : file.content,
            datefile : file.datefile,
            user_id : file.user_id
        }, httpOptions);
    }

    create(file: File): Observable<object> {
        return this.http.post('/api/create-file', {
            idfile : file.idfile,
            name : file.name,
            content : file.content,
            datefile : file.datefile,
            user_id : file.user_id
        }, httpOptions);
    }

    delete_file(file: File): Observable<object> {
        return this.http.post('/api/delete-file', {
            idfile: file.idfile
        }, httpOptions);
    }
}
