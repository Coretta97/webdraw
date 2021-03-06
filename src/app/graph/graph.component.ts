import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import * as go from 'gojs';
import { GuidedDraggingTool } from 'gojs/extensionsTS/GuidedDraggingTool';

@Component({
    selector: 'app-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {
    private diagram: go.Diagram = new go.Diagram();
    private palette: go.Palette = new go.Palette();

    private linkType = 1;
    private $ = go.GraphObject.make;


    @ViewChild('diagramDiv')
    private diagramRef: ElementRef;

    @ViewChild('paletteDiv')
    private paletteRef: ElementRef;

    @Input()
    get model(): go.Model { return this.diagram.model; }
    set model(val: go.Model) { this.diagram.model = val; }

    @Output()
    nodeSelected = new EventEmitter<go.Node|null>();

    @Output()
    modelChanged = new EventEmitter<go.ChangedEvent>();

    constructor() {
        const him = this;
        this.diagram = new go.Diagram();
        this.diagram.initialContentAlignment = go.Spot.Center;
        this.diagram.allowDrop = true;
        this.diagram.undoManager.isEnabled = true;
        this.diagram.toolManager.draggingTool = new GuidedDraggingTool();
        this.diagram.addDiagramListener('ChangedSelection',
            e => {
                const node = e.diagram.selection.first();
                this.nodeSelected.emit(node instanceof go.Node ? node : null);
            });
        this.diagram.addModelChangedListener(e => {
            return e.isTransactionFinished && this.modelChanged.emit(e);
        });

        this.diagram.addDiagramListener('LinkDrawn', function(e) {
            const link = e.subject;
            if (!link.data.relationship) {
                link.data.relationship = him.linkType;
            }
            if (!link.data.card_l) {
                link.data.card_l = '1';
            }
            if (!link.data.card_r) {
                link.data.card_r = '1';
            }

            link.updateTargetBindings();
            link.updateRelationshipsFromData();
        });

        // the item template for properties
        const propertyTemplate =
            this.$(go.Panel, 'Horizontal',
                // property name, underlined if scope=='class' to indicate static property
                this.$(go.TextBlock,
                    { isMultiline: false, editable: true },
                    new go.Binding('text', 'name').makeTwoWay(),
                    new go.Binding('isUnderline', 'scope', function(s) { return s[0] === 'c'} )),
                // property type, if known
                this.$(go.TextBlock, '',
                    new go.Binding('text', 'type', function(t) { return (t ? ': ' : ''); })),
                this.$(go.TextBlock,
                    { isMultiline: false, editable: true },
                    new go.Binding('text', 'type').makeTwoWay()),
                // property default value, if any
                this.$(go.TextBlock,
                    { isMultiline: false, editable: false },
                    new go.Binding('text', 'default', function(s) { return s ? ' = ' + s : ''; }))
            );

        // the item template for methods
        const methodTemplate =
            this.$(go.Panel, 'Horizontal',
                // method name, underlined if scope=='class' to indicate static method
                this.$(go.TextBlock,
                    { isMultiline: false, editable: true },
                    new go.Binding('text', 'name').makeTwoWay(),
                    new go.Binding('isUnderline', 'scope', function(s) { return s[0] === 'c' })),
                // method parameters
                this.$(go.TextBlock, '()',
                    // this does not permit adding/editing/removing of parameters via inplace edits
                    new go.Binding('text', 'parameters', function(parr) {
                        let s = '(';
                        for (let i = 0; i < parr.length; i++) {
                            const param = parr[i];
                            if (i > 0) s += ', ';
                            s += param.name + ': ' + param.type;
                        }
                        return s + ')';
                    })),
                // method return type, if any
                this.$(go.TextBlock, '',
                    new go.Binding('text', 'type', function(t) { return (t ? ': ' : ''); })),
                this.$(go.TextBlock,
                    { isMultiline: false, editable: true },
                    new go.Binding('text', 'type').makeTwoWay())
            );
        this.diagram.nodeTemplate =
            this.$(go.Node, 'Auto',  // the whole node panel
                { selectionAdorned: true,
                    resizable: false,
                    layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
                    fromSpot: go.Spot.AllSides,
                    toSpot: go.Spot.AllSides,
                    isShadowed: true,
                    shadowColor: '#C5C1AA' },
                new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),  // convert string into a Point value
                // whenever the PanelExpanderButton changes the visible property of the 'LIST' panel,
                // clear out any desiredSize set by the ResizingTool.
                // new go.Binding('desiredSize', 'visible', function(v) { return new go.Size(NaN, NaN); }).ofObject('LIST'),
                // define the node's outer shape, which will surround the Table
                this.$(go.Shape, 'Rectangle',
                    { fill: 'white', stroke: '#756875', strokeWidth: 1, portId: '', cursor: 'pointer',
                        // allow many kinds of links
                        fromLinkable: true, toLinkable: true,
                        fromLinkableSelfNode: true, toLinkableSelfNode: true,
                        fromLinkableDuplicates: true, toLinkableDuplicates: true }),
                this.$(go.Panel, 'Table',
                    { defaultRowSeparatorStroke: 'black', minSize : new go.Size(200 , 0) },
                    // header
                    this.$(go.TextBlock,
                        {
                            row: 0, columnSpan: 2, margin: 10, alignment: go.Spot.Center,
                            font: 'bold 12pt sans-serif',
                            isMultiline: false, editable: true
                        },
                        new go.Binding('text', 'text').makeTwoWay()),
                    // properties
                    this.$(go.TextBlock, 'Properties',
                        { row: 1, font: 'italic 10pt sans-serif' },
                        new go.Binding('visible', 'visible', function(v) { return !v; }).ofObject('PROPERTIES')),
                    this.$(go.Panel, 'Vertical', { name: 'PROPERTIES' },
                        new go.Binding('itemArray', 'properties'),
                        {
                            row: 1, margin: 3, stretch: go.GraphObject.Fill,
                            defaultAlignment: go.Spot.Left, background: 'white',
                            itemTemplate: propertyTemplate
                        }
                    ),
                    this.$('PanelExpanderButton', 'PROPERTIES',
                        { row: 1, column: 1, alignment: go.Spot.TopRight, visible: false },
                        new go.Binding('visible', 'properties', function(arr) { return arr.length > 0; })),
                    // methods
                    this.$(go.TextBlock, 'Methods',
                        { row: 2, font: 'italic 10pt sans-serif' },
                        new go.Binding('visible', 'visible', function(v) { return !v; }).ofObject('METHODS')),
                    this.$(go.Panel, 'Vertical', { name: 'METHODS' },
                        new go.Binding('itemArray', 'methods'),
                        {
                            row: 2, margin: 3, stretch: go.GraphObject.Fill,
                            defaultAlignment: go.Spot.Left, background: 'white',
                            itemTemplate: methodTemplate
                        }
                    ),
                    this.$('PanelExpanderButton', 'METHODS',
                        { row: 2, column: 1, alignment: go.Spot.TopRight, visible: false },
                        new go.Binding('visible', 'methods', function(arr) { return arr.length > 0; }))
                )  // end Table Panel
            );  // end Node
        this.diagram.linkTemplate =
            this.createLinkTemplate(1);

        this.palette = new go.Palette();
        this.palette.nodeTemplateMap = this.diagram.nodeTemplateMap;

        // initialize contents of Palette
        this.palette.model.nodeDataArray =
            [
                { text: 'class', color: 'lightblue' },
            ];
    }

    private createLinkTemplate(type: number) {
        function convertToArrow(t) {
            switch (t) {
                case 0:
                    return 'OpenTriangle';
                case 1:
                    return 'Triangle';
                case 2:
                    return 'StretchedDiamond';
                case 3:
                    return 'StretchedDiamond';
                default:
                    return 'Triangle';
            }
        }
        function convertFill(f) {
            switch (f) {
                case 0:
                    return 'white';
                case 1:
                    return 'white';
                case 2:
                    return 'white';
                case 3:
                    return 'back';
                default:
                    return 'white';
            }
        }
        const link =  this.$(go.Link,
            // allow relinking
            { relinkableFrom: true, relinkableTo: true, routing: go.Link.Orthogonal},
            this.$(go.Shape),
            this.$(go.Shape, new go.Binding('fill', 'relationship', convertFill), new go.Binding('toArrow', 'relationship', convertToArrow)),
            this.$(go.TextBlock, '1',
                {
                    font: '400 9pt Source Sans Pro, sans-serif',
                    segmentIndex: 1,
                    segmentOffset: new go.Point(NaN, NaN),
                    isMultiline: false,
                    editable: true
                },
                new go.Binding('text', 'card_l').makeTwoWay()),
            this.$(go.TextBlock, 'relation',
                {
                    font: '400 9pt Source Sans Pro, sans-serif',
                    segmentIndex: 2,
                    segmentOffset: new go.Point(NaN, NaN),
                    isMultiline: false,
                    editable: true
                },
                new go.Binding('text', 'text').makeTwoWay()),
            this.$(go.TextBlock, '1',
                {
                    font: '400 9pt Source Sans Pro, sans-serif',
                    segmentIndex: 4,
                    segmentOffset: new go.Point(-20, -10),
                    isMultiline: false,
                    editable: true
                },
                new go.Binding('text', 'card_r').makeTwoWay()),
        );
        return link;
    }
    setLink(type: number) {
        this.linkType = type;
    }

    ngOnInit() {
        this.diagram.div = this.diagramRef.nativeElement;
        this.palette.div = this.paletteRef.nativeElement;
    }
}
