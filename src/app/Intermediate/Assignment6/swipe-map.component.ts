import { Component, ElementRef, OnInit, ViewChild , Output, EventEmitter} from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol.js";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import TileLayer from "@arcgis/core/layers/TileLayer.js";
import Swipe from "@arcgis/core/widgets/Swipe.js";

@Component({
    selector: 'swipe-map',
    templateUrl: './swipe-map.component.html',
    styleUrls: ['./swipe-map.component.scss']
})
export class SwipeMapComponent implements OnInit{
    @ViewChild('mapPanel', { static: true }) mapPanel!: ElementRef;
    map: Map | null = null;
    mapView: MapView | null = null;
    pictureMarker!: PictureMarkerSymbol;
    world_ocean_base_layer = new TileLayer({url:'https://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer'});
    street_layer = new TileLayer({url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer'})
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

        const mapSwipe = new Swipe({
            view: this.mapView,
            leadingLayers: [this.world_ocean_base_layer],
            trailingLayers: [this.street_layer],
            direction: "horizontal",
            position: 50
        })

        this.map.add(this.world_ocean_base_layer)
        this.map.add(this.street_layer)
        this.mapView.ui.add(mapSwipe)
        
    }
}