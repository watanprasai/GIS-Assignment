import { Component, ElementRef, OnInit, ViewChild , Output, EventEmitter} from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import Graphic from '@arcgis/core/Graphic';
import { CustomPoint } from '../../Beginner/2_1/custom-point';
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import { Message } from 'primeng/api';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import Polygon from "@arcgis/core/geometry/Polygon.js";
import * as closestFacility from '@arcgis/core/rest/closestFacility';
import ClosestFacilityParameters from '@arcgis/core/rest/support/ClosestFacilityParameters';
import FeatureSet from "@arcgis/core/rest/support/FeatureSet.js";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";
import Polyline from "@arcgis/core/geometry/Polyline.js";
import * as route from "@arcgis/core/rest/route";
import RouteParameters from "@arcgis/core/rest/support/RouteParameters.js";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol.js";

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
    marker!: SimpleMarkerSymbol
    customPoint :CustomPoint = new CustomPoint
    pointTemp: Graphic[] = [];
    directionTemp:any[] = [];
    // drawPath:Graphic[] = [];
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
            this.marker = new SimpleMarkerSymbol({
                color: [226, 119, 40],
                outline: {
                    color: [0, 0, 0],
                    width: 2,
                },
            });
        } else {
            this.marker = new SimpleMarkerSymbol({
                color: [0, 180, 40],
                outline: {
                    color: [255, 255, 255],
                    width: 2,
                },
            });
        }
        const pointGraphic = new Graphic({
            geometry: this.point,
            symbol: this.marker,
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
            response.routeResults[0].directions.features.forEach((data) => {
                const pathToDestination = new Polyline({
                    paths: (data.geometry as Polyline).paths
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