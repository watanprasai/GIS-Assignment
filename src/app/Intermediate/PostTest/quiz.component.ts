import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import Graphic from '@arcgis/core/Graphic';
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import Polygon from "@arcgis/core/geometry/Polygon.js";
import { MessageService } from 'primeng/api';

@Component({
    selector: 'quiz-app',
    templateUrl: './quiz.component.html',
    styleUrls: ['./quiz.component.scss'],
    providers: [MessageService]
})
export class QuizComponent implements OnInit{
    constructor(private messageService: MessageService) {}
    @ViewChild('mapPanel', { static: true }) mapPanel!: ElementRef;
    map: Map | null = null;
    mapView: MapView | null = null;
    latitude:number = 0;
    longitude:number = 0;
    bufferGraphic!: Graphic;
    cdgPoint!: Point;
    popupState : boolean = false;
    bufferGeometry:any
    marker:any
    ngOnInit() {
        this.map = new Map({
            basemap: 'topo-vector',
          });
      
          this.mapView = new MapView({
            container: this.mapPanel.nativeElement,
            map: this.map,
            center: [100.5441, 13.7034348], // [longitude, latitude]
            zoom: 15,
          });

          this.cdgPoint = new Point({
            latitude: 13.703268024918675,
            longitude: 100.54373521957397,
            spatialReference: {
                wkid: 102100
            }
          })

        this.bufferGeometry = geometryEngine.buffer(this.cdgPoint, 20, 'kilometers');
        const filledColor:SimpleFillSymbol = new SimpleFillSymbol({
            color: [236, 143, 94, 0.5],
        })
        this.bufferGraphic = new Graphic({
            geometry: this.bufferGeometry as Polygon,
            symbol: filledColor
        })
        this.mapView?.graphics.add(this.bufferGraphic)

        this.mapView.on('click', (event)=> {
            this.latitude = event.mapPoint.latitude;
            this.longitude = event.mapPoint.longitude;
        })
    }
    
    check() {
        this.mapView?.graphics.remove(this.marker)
        const point = new Point({
            latitude: this.latitude,
            longitude: this.longitude,
            spatialReference: {
                wkid: 102100
            }
        })
        const markFill = new SimpleMarkerSymbol({
            color:[160,255,100]
        })
        this.marker = new Graphic({
            geometry: point,
            symbol: markFill
        })
        this.mapView?.graphics.add(this.marker)
        const isInside = geometryEngine.contains(this.bufferGeometry as Polygon, point);
        console.log('Is inside buffer:', isInside);
        if (isInside) {
            this.messageService.add({ severity: 'info', summary: 'Result', detail: 'In coverage area' });
        } else {
            this.messageService.add({ severity: 'info', summary: 'Result', detail: 'Out of coverage area' });
        }
    }

    clear() {
        this.latitude = 0
        this.longitude = 0
    }
}