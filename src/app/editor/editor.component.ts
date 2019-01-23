import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FilesService} from '../files.service';
import {File} from '../models/File';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss']
})

export class EditorComponent implements OnInit {
    private files: File[] = [];
    private file_names: string[] = [];
    public file: File = null;
    constructor(private authentificationService: AuthenticationService, private filesService: FilesService, private router: Router, private activatedRoute: ActivatedRoute) {

        if (!this.authentificationService.isConnected()) {
            this.router.navigateByUrl('/login');
        }

        const him: EditorComponent = this;
        this.filesService.files().subscribe(r => {
            if (r['error']) {
                // Nothing to do for the moment
            } else {
                r['files'].forEach(function (file) {
                    him.files.push(new File(file.idfile, file.name, file.user_id, file.datefile));
                    him.file_names.push(file.name);

                    if (him.activatedRoute.snapshot.paramMap.get('name') === file.name) {
                        him.file = file;
                    }
                });
                if (this.file === null) {
                    this.router.navigateByUrl('/home');
                }
            }
        });
    }

    ngOnInit() {
    }

}
