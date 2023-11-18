import { Component, ElementRef, OnInit, ViewChild , Output, EventEmitter} from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import Graphic from '@arcgis/core/Graphic';
import { CustomPoint } from '../../Beginner/2_1/custom-point';
import FeatureSet from "@arcgis/core/rest/support/FeatureSet.js";
import Polyline from "@arcgis/core/geometry/Polyline.js";
import * as route from "@arcgis/core/rest/route";
import RouteParameters from "@arcgis/core/rest/support/RouteParameters.js";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol.js";
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol.js";

@Component({
    selector:'map-route-service',
    templateUrl: './route-map.component.html',
    styleUrls: ['./route-map.component.scss']
})
export class RouteMapComponent{
    @ViewChild('mapPanel', { static: true }) mapPanel!: ElementRef;
    @Output() coordinate:EventEmitter<CustomPoint> = new EventEmitter<CustomPoint>()
    map: Map | null = null;
    mapView: MapView | null = null;
    point: Point | null = null;
    customPoint :CustomPoint = new CustomPoint;
    pointTemp: Graphic[] = [];
    directionTemp:any[] = [];
    pictureMarker!: PictureMarkerSymbol;
    ngOnInit() {
      this.map = new Map({
        basemap: 'topo-vector',
      });
  
      this.mapView = new MapView({
        container: this.mapPanel.nativeElement,
        map: this.map,
        center: [-117.117, 32.70781494080129], // [longitude, latitude]
        zoom: 15,
      });

      this.mapView.on('click', (event) => {
        this.point = new Point({
            longitude: event.mapPoint.longitude,
            latitude: event.mapPoint.latitude,
        });
        
        if (this.pointTemp.length == 0) {
            this.pictureMarker = new PictureMarkerSymbol({
                url: "../../../assets/orange-pin.svg",
                width: "30px",
                height: "30px",
            });
            
        } else {
            this.pictureMarker = new PictureMarkerSymbol({
                url: "../../../assets/green-pin.svg",
                width: "26px",
                height: "26px",
            });            
        }
        const pointGraphic = new Graphic({
            geometry: this.point,
            symbol: this.pictureMarker,
        });
        this.pointTemp.push(pointGraphic);
        this.mapView?.graphics.add(pointGraphic);
      } )
    }

    startRoute() {
        const routeUrl = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/NetworkAnalysis/SanDiego/NAServer/Route"
        const routeParams = new RouteParameters({
            stops: new FeatureSet({
                features: this.pointTemp
            }),
            returnDirections: true
        })
        route.solve(routeUrl, routeParams).then((response) => {
            this.directionTemp = response.routeResults[0].directions.features
            response.routeResults[0].directions.features.forEach((data:any) => {
                const pathToDestination = new Polyline({
                    paths: data.geometry.paths
                })
                const line = new SimpleLineSymbol({
                    color: "blue",
                    width: "2px",
                    style: "solid",
                });
                const drawPath = new Graphic({
                    geometry: pathToDestination,
                    symbol: line
                })
                this.mapView?.graphics.add(drawPath);
            })
        })
        
    }

    clear() {
        this.mapView?.graphics.removeAll();
        this.pointTemp = [];
        this.directionTemp = [] 
    }

    goTo(data:any) {
        this.directionTemp.forEach((i:any) => {
            i.clicked = false;
        })
        data.clicked = true;
        this.mapView?.goTo(data.geometry)
    }
}