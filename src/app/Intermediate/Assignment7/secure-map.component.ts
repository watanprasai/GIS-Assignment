import { Component, ElementRef, OnInit, ViewChild , Output, EventEmitter} from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol.js";
import LayerList from "@arcgis/core/widgets/LayerList.js";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import TileLayer from "@arcgis/core/layers/TileLayer.js";
import * as urlUtils from "@arcgis/core/core/urlUtils";
@Component({
    selector: 'secure-map',
    templateUrl: './secure-map.component.html',
    styleUrls: ['./secure-map.component.scss']
})
export class SecureMapComponent implements OnInit{
    @ViewChild('mapPanel', { static: true }) mapPanel!: ElementRef;
    map: Map | null = null;
    mapView: MapView | null = null;
    pictureMarker!: PictureMarkerSymbol;
    mapLayer = new MapImageLayer({url:'https://gisserv1.cdg.co.th/arcgis/rest/services/AtlasX/AtlasX_Secure/MapServer'});
    ngOnInit() {;
        urlUtils.addProxyRule({
            urlPrefix: "arcgis-server-url",
            proxyUrl: "https://<atlasx-web-service-url>/api/appproxy"
        });

        this.map = new Map({
            basemap: 'topo-vector',
        });
    
        this.mapView = new MapView({
            container: this.mapPanel.nativeElement,
            map: this.map,
            center: [100.5441, 13.7034348], // [longitude, latitude]
            zoom: 15,
        });

        this.map.add(this.mapLayer);
    }
}