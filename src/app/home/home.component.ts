import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {Router} from '@angular/router';
import {User} from '../models/User';
import {File} from '../models/File';
import {FilesService} from '../files.service';
import {MDBModalRef, ModalDirective} from 'angular-bootstrap-md';
import index from '@angular/cli/lib/cli';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    @ViewChild('basicModal')
    basicModal: ModalDirective;
    @ViewChild('basicModal2')
    basicModal2: ModalDirective;
    @ViewChild('basicModal3')
    basicModal3: ModalDirective;

    public user: User;
    public files: File[] = [];
    public names: string[] = [];
    public suppFile: File = null;

    public nfile = {
        name: '',
        error: false,
        error2: false
    };

    public ufile = {
        file: null,
        name: '',
        error: false,
        error2: false
    };

    constructor(private authentificationService: AuthenticationService, private router: Router, private fileService: FilesService) {
        if (!this.authentificationService.isConnected()) {
            this.router.navigateByUrl('/login');
        }
        this.user = authentificationService.getUser();

        this.fileService.files().subscribe(f => {
            if (f['error']) {
                alert('Error');
            } else {
                f['files'].forEach(file => {
                    this.files.push(new File(file.idfile, file.name, file.user_id, file.datefile, file.content));
                    this.names.push(file.name);
                });

                this.actualize();
            }
        });
    }

    private actualize() {
        this.files.sort((a, b) => {
            return b.timestamp() - a.timestamp();
        });
        this.names = [];
        this.files.forEach(file => {
            this.names.push(file.name);
        });
    }

    public addDiagram() {
        if (this.names.includes(this.nfile.name)) {
            this.nfile.error = true;
            this.nfile.error2 = false;
        } else if (this.nfile.name === '') {
            this.nfile.error = false;
            this.nfile.error2 = true;
        } else {

            this.fileService.create(new File(-1, this.nfile.name, this.user.iduser, null, null)).subscribe(f => {
                if (f['error']) {
                    alert('Error');
                } else {
                    const file = new File(f['file']['idfile'], f['file']['name'], f['file']['user_id'], f['file']['datefile'], f['file']['content']);
                    this.nfile = {
                        name: '',
                        error: false,
                        error2: false
                    };
                    this.basicModal.hide();

                    this.files.push(file);

                    this.actualize();
                }
            });
        }
    }

    public openSuppModal(file: File) {
        this.suppFile = file;
        this.basicModal2.show();
    }

    public deleteFile() {
        this.fileService.delete_file(this.suppFile).subscribe(r => {
            if (r['error']) {
                // Nothing
            } else {
                this.basicModal2.hide();
                this.files = this.files.filter(f => {
                    return f.idfile !== this.suppFile.idfile;
                });
                this.suppFile = null;
                this.actualize();
            }
        });
    }

    public openUpdateModal(file: File) {
        this.ufile.file = file;
        this.ufile.name = file.name;
        this.basicModal3.show();
    }

    public updateDiagramName() {
        if (this.ufile.name === '' ) {
            this.ufile.error2 = true;
            this.ufile.error = false;
        } else if (this.ufile.name !==  this.ufile.file.name && this.names.includes(this.ufile.name)) {
            this.ufile.error = true;
            this.ufile.error2 = false;
        } else {
            this.ufile.file.name = this.ufile.name;
            this.fileService.save(this.ufile.file).subscribe(r => {
                if (r['error']) {
                    // Nothing
                } else {
                    this.basicModal3.hide();
                    this.actualize();
                    this.ufile = {
                        file: null,
                        name: '',
                        error2: false,
                        error: false
                    };
                }
            });
        }
    }
    ngOnInit() {
    }

}
