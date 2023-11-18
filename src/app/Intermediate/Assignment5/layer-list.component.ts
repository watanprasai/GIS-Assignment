import { Component, ElementRef, OnInit, ViewChild , Output, EventEmitter} from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import { CustomPoint } from '../../Beginner/2_1/custom-point';
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol.js";
import LayerList from "@arcgis/core/widgets/LayerList.js";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import TileLayer from "@arcgis/core/layers/TileLayer.js";

@Component({
    selector: 'layer-list',
    templateUrl: './layer-list.component.html',
    styleUrls: ['./layer-list.component.scss']
})
export class LayerListComponent implements OnInit{
    @ViewChild('mapPanel', { static: true }) mapPanel!: ElementRef;
    @Output() coordinate:EventEmitter<CustomPoint> = new EventEmitter<CustomPoint>()
    map: Map | null = null;
    mapView: MapView | null = null;
    point: Point | null = null;
    customPoint :CustomPoint = new CustomPoint;
    pointTemp: Graphic[] = [];
    directionTemp:any[] = [];
    pictureMarker!: PictureMarkerSymbol;
    world_ocean_base_layer = new TileLayer({url:'https://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer'});
    cencus_layer = new MapImageLayer({url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer'})
    ngOnInit() {;

        this.map = new Map({
            basemap: 'topo-vector',
        });
    
        this.mapView = new MapView({
            container: this.mapPanel.nativeElement,
            map: this.map,
            center: [-117.117, 32.70781494080129], // [longitude, latitude]
            zoom: 15,
        });

        const layerList = new LayerList({
            view: this.mapView
        })

        this.mapView.ui.add(layerList,{
            position: "top-right"
        })
        this.map.add(this.world_ocean_base_layer)
        this.map.add(this.cencus_layer)
    }
}