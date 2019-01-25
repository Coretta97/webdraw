import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FilesService} from '../files.service';
import {File} from '../models/File';
import * as go from 'gojs';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss']
})

export class EditorComponent implements OnInit {
    private files: File[] = [];
    private file_names: string[] = [];
    public file: File = null;
    public attribute = {
        name:  '',
        type : '',
        error : false,
        del_att: null,
    };
    public method = {
        name: '',
        type : '',
        error : false,
        del_met: null
    };


    model;

    @ViewChild('text')
    private textField: ElementRef;

    data: any;
    node: go.Node;

    @ViewChild('basicModal')
    private addAttributeModal: ElementRef;

    @ViewChild('basicModal2')
    private addMethodModal: ElementRef;



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
                    him.files.push(new File(file.idfile, file.name, file.user_id, file.datefile, file.content));
                    him.file_names.push(file.name);

                    if (him.activatedRoute.snapshot.paramMap.get('name') === file.name) {
                        him.file = file;

                        const content = JSON.parse(him.file.content);
                        him.model = new go.GraphLinksModel(content['nodes'], content['links']);
                    }
                });
                if (this.file === null) {
                    this.router.navigateByUrl('/home');
                }
            }
        });
    }

    deleteAttribute() {
        const name = this.attribute.del_att;
        if (this.attribute.del_att) {
            this.node.data.properties = this.node.data.properties.filter(property => {
                return property.name !== name;
            });
            this.node.updateTargetBindings();
        }
    }

    deleteMethod() {
        const name = this.method.del_met;
        if (name) {
            this.node.data.methods = this.node.data.methods.filter(method => {
                return method.name !== name;
            });
            this.node.updateTargetBindings();
        }
    }

    addAttribute() {
        if (this.attribute.name !== '' && this.attribute.type !== '') {
            if (this.node) {
                if (! this.node.data.properties) {
                    this.node.data.properties = [];
                }
                this.node.data.properties.push({name: this.attribute.name, type: this.attribute.type});
            }
            this.node.updateTargetBindings();
            this.attribute = {
                name: '',
                type: '',
                error : false,
                del_att: this.attribute.del_att
            }
            this.addAttributeModal.hide();
        } else {
            this.attribute.error = true;
        }
    }

    addMethod() {
        if (this.method.name !== '' && this.method.type !== '') {
            if (this.node) {
                if (! this.node.data.methods) {
                    this.node.data.methods = [];
                }
                this.node.data.methods.push({name: this.method.name, type: this.method.type});
            }
            this.node.updateTargetBindings();
            this.method = {
                name: '',
                type: '',
                error: false,
                del_met: this.method.del_met
            }
            this.addMethodModal.hide();
        } else {
            this.method.error = true;
        }

    }

    save(): void {
        const  data = {
            nodes : [],
            links : []
        };
        data.nodes = this.model.nodeDataArray;
        data.links = this.model.linkDataArray;
        this.file.content = JSON.stringify(data);
        this.filesService.save(this.file).subscribe(r => {
            if (r['error'] === 1) {
                alert('Erreur');
            }
        });
    }

    showDetails(node: go.Node | null) {
        this.node = node;
        if (node) {
            // copy the editable properties into a separate Object
            this.data = {
                text: node.data.text,
                color: node.data.color
            };
        } else {
            this.data = null;
        }
    }

    onCommitDetails() {
        if (this.node) {
            const model = this.node.diagram.model;
            // copy the edited properties back into the node's model data,
            // all within a transaction
            model.startTransaction();
            model.setDataProperty(this.node.data, 'text', this.data.text);
            model.setDataProperty(this.node.data, 'color', this.data.color);
            model.commitTransaction('modified properties');
        }
    }

    onCancelChanges() {
        // wipe out anything the user may have entered
        this.showDetails(this.node);
    }

    onModelChanged(c: go.ChangedEvent) {
        // who knows what might have changed in the selected node and data?
        this.showDetails(this.node);
    }


    ngOnInit() {
    }

}
