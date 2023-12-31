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
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol.js";

@Component({
    selector:'query-task',
    templateUrl: './query-task.component.html',
    styleUrls: ['./query-task.component.scss']
})
export class QueryTaskComponent implements OnInit{
    @ViewChild('mapPanel', { static: true }) mapPanel!: ElementRef;
    @Output() coordinate:EventEmitter<CustomPoint> = new EventEmitter<CustomPoint>()
    map: Map | null = null;
    mapView: MapView | null = null;
    point: Point | null = null;
    marker: SimpleMarkerSymbol | null = null;
    pointGraphic: Graphic | null = null;
    customPoint :CustomPoint = new CustomPoint
    messages!: Message[]
    stateOutline!: Graphic;
    stateInfo!:any
    ngOnInit() {
      this.fetchData() 
      const layer = new MapImageLayer({
        url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/',
        });
      this.map = new Map({
        basemap: 'topo-vector',
      });
  
      this.mapView = new MapView({
        container: this.mapPanel.nativeElement,
        map: this.map,
        center: [-115.10233698, 41.14362082], // [longitude, latitude]
        zoom: 15,
      });
  
      this.point = new Point({
        longitude: -115.10233698,
        latitude: 41.14362082,
      });
      
      this.marker = new SimpleMarkerSymbol({
        color: [226, 119, 40],
        outline: {
          color: [255, 255, 255],
          width: 2,
        },
      });
  
      this.pointGraphic = new Graphic({
        geometry: this.point,
        symbol: this.marker,
      });
      this.mapView.graphics.add(this.pointGraphic);

      this.mapView.on('click', (event) => { 
        this.customPoint = {longitude:event.mapPoint.longitude , latitude:event.mapPoint.latitude}
        this.coordinate.emit(this.customPoint)
      });
      this.fetchData()
      this.map.add(layer);
    }

    onClickRow(data: any) {
        this.mapView?.graphics.removeAll()
        const mapPanel = document.getElementById("mapPanel");
        if (mapPanel) {
            mapPanel.style.cursor = "wait"
        }
        this.stateInfo.forEach((item:any) => {
            item.clicked = false;
        });
        data.clicked = true;
        this.mapView?.graphics.remove(this.stateOutline);
        const geoSym:SimpleFillSymbol = new SimpleFillSymbol({
          color: [255, 165, 0, 0.5]
        })
        this.stateOutline = new Graphic({
            geometry: data.geometry,
            symbol: geoSym
        });
        this.mapView?.graphics.add(this.stateOutline);
        const polygon = new Polygon({
            rings: data.geometry.rings[0]
        })
        
        this.mapView?.goTo({
            target: polygon.extent.expand(1.5)
        });
        this.marker = new SimpleMarkerSymbol({
            color: [226, 119, 40],
            outline: {
              color: [255, 255, 255],
              width: 2,
            },
          });
      
        this.pointGraphic = new Graphic({
        geometry: polygon.centroid,
        symbol: this.marker,
        });
        this.mapView?.graphics.add(this.pointGraphic);
        if (mapPanel) {
            mapPanel.style.cursor = "auto"
        }
    }

    fetchData() {
        const featureLayer = new FeatureLayer({
            url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2'
        });
        const query = featureLayer.createQuery();
        query.where = '1=1';
        query.outFields = ['*'];
        query.returnGeometry = true;
        featureLayer.queryFeatures(query).then((res) => {
          this.stateInfo = res.features
        })
        
    }

    showMessage(detail: string): void {
        this.messages = [{ severity: 'warn', summary: 'เกิดข้อผิดพลาด', detail }];
        setTimeout(() => this.messages = [], 5000);
    } 

}