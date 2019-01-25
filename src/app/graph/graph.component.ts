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
        const $ = go.GraphObject.make;
        // Place GoJS license key here:
        (go as any).licenseKey = 'localhost';
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
        this.diagram.addModelChangedListener(e => e.isTransactionFinished && this.modelChanged.emit(e));


        // the item template for properties
        const propertyTemplate =
            $(go.Panel, 'Horizontal',
                // property name, underlined if scope=='class' to indicate static property
                $(go.TextBlock,
                    { isMultiline: false, editable: true },
                    new go.Binding('text', 'name').makeTwoWay(),
                    new go.Binding('isUnderline', 'scope', function(s) { return s[0] === 'c'} )),
                // property type, if known
                $(go.TextBlock, '',
                    new go.Binding('text', 'type', function(t) { return (t ? ': ' : ''); })),
                $(go.TextBlock,
                    { isMultiline: false, editable: true },
                    new go.Binding('text', 'type').makeTwoWay()),
                // property default value, if any
                $(go.TextBlock,
                    { isMultiline: false, editable: false },
                    new go.Binding('text', 'default', function(s) { return s ? ' = ' + s : ''; }))
            );

        // the item template for methods
        const methodTemplate =
            $(go.Panel, 'Horizontal',
                // method name, underlined if scope=='class' to indicate static method
                $(go.TextBlock,
                    { isMultiline: false, editable: true },
                    new go.Binding('text', 'name').makeTwoWay(),
                    new go.Binding('isUnderline', 'scope', function(s) { return s[0] === 'c' })),
                // method parameters
                $(go.TextBlock, '()',
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
                $(go.TextBlock, '',
                    new go.Binding('text', 'type', function(t) { return (t ? ': ' : ''); })),
                $(go.TextBlock,
                    { isMultiline: false, editable: true },
                    new go.Binding('text', 'type').makeTwoWay())
            );
        this.diagram.nodeTemplate =
            $(go.Node, 'Auto',  // the whole node panel
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
                $(go.Shape, 'Rectangle',
                    { fill: 'white', stroke: '#756875', strokeWidth: 1, portId: '', cursor: 'pointer',
                        // allow many kinds of links
                        fromLinkable: true, toLinkable: true,
                        fromLinkableSelfNode: true, toLinkableSelfNode: true,
                        fromLinkableDuplicates: true, toLinkableDuplicates: true }),
                $(go.Panel, 'Table',
                    { defaultRowSeparatorStroke: 'black' },
                    // header
                    $(go.TextBlock,
                        {
                            row: 0, columnSpan: 2, margin: 10, alignment: go.Spot.Center,
                            font: 'bold 12pt sans-serif',
                            isMultiline: false, editable: true
                        },
                        new go.Binding('text', 'text').makeTwoWay()),
                    // properties
                    $(go.TextBlock, 'Properties',
                        { row: 1, font: 'italic 10pt sans-serif' },
                        new go.Binding('visible', 'visible', function(v) { return !v; }).ofObject('PROPERTIES')),
                    $(go.Panel, 'Vertical', { name: 'PROPERTIES' },
                        new go.Binding('itemArray', 'properties'),
                        {
                            row: 1, margin: 3, stretch: go.GraphObject.Fill,
                            defaultAlignment: go.Spot.Left, background: 'white',
                            itemTemplate: propertyTemplate
                        }
                    ),
                    $('PanelExpanderButton', 'PROPERTIES',
                        { row: 1, column: 1, alignment: go.Spot.TopRight, visible: false },
                        new go.Binding('visible', 'properties', function(arr) { return arr.length > 0; })),
                    // methods
                    $(go.TextBlock, 'Methods',
                        { row: 2, font: 'italic 10pt sans-serif' },
                        new go.Binding('visible', 'visible', function(v) { return !v; }).ofObject('METHODS')),
                    $(go.Panel, 'Vertical', { name: 'METHODS' },
                        new go.Binding('itemArray', 'methods'),
                        {
                            row: 2, margin: 3, stretch: go.GraphObject.Fill,
                            defaultAlignment: go.Spot.Left, background: 'white',
                            itemTemplate: methodTemplate
                        }
                    ),
                    $('PanelExpanderButton', 'METHODS',
                        { row: 2, column: 1, alignment: go.Spot.TopRight, visible: false },
                        new go.Binding('visible', 'methods', function(arr) { return arr.length > 0; }))
                )  // end Table Panel
            );  // end Node


        function convertIsTreeLink(r) {
            return r === 'generalization';
        }

        function convertFromArrow(r) {
            switch (r) {
                case 'generalization': return '';
                default: return '';
            }
        }

        function convertToArrow(r) {
            switch (r) {
                case 'generalization': return 'Triangle';
                case 'aggregation': return 'StretchedDiamond';
                default: return '';
            }
        }
        this.diagram.linkTemplate =
            $(go.Link,
                // allow relinking
                { relinkableFrom: true, relinkableTo: true, routing: go.Link.Orthogonal },
                $(go.Shape),
                $(go.Shape, { toArrow: 'OpenTriangle' }),
                $(go.TextBlock, '1',
                    {
                        font: '400 9pt Source Sans Pro, sans-serif',
                        segmentIndex: 1,
                        segmentOffset: new go.Point(NaN, NaN),
                        isMultiline: false,
                        editable: true
                    },
                    new go.Binding('card_l', 'card_l').makeTwoWay()),
                $(go.TextBlock, 'relation',
                    {
                        font: '400 9pt Source Sans Pro, sans-serif',
                        segmentIndex: 2,
                        segmentOffset: new go.Point(NaN, NaN),
                        isMultiline: false,
                        editable: true
                    },
                    new go.Binding('text', 'text').makeTwoWay()),
                $(go.TextBlock, '1',
                    {
                        font: '400 9pt Source Sans Pro, sans-serif',
                        segmentIndex: 4,
                        segmentOffset: new go.Point(-20, -10),
                        isMultiline: false,
                        editable: true
                    },
                    new go.Binding('card_r', 'card_r').makeTwoWay()),
            );

        this.palette = new go.Palette();
        this.palette.nodeTemplateMap = this.diagram.nodeTemplateMap;

        // initialize contents of Palette
        this.palette.model.nodeDataArray =
            [
                { text: 'class', color: 'lightblue' },
            ];
    }

    ngOnInit() {
        this.diagram.div = this.diagramRef.nativeElement;
        this.palette.div = this.paletteRef.nativeElement;
    }
}
