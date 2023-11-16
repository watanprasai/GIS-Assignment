import { Component, ElementRef, OnInit, ViewChild , Output, EventEmitter} from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import Graphic from '@arcgis/core/Graphic';
import { CustomPoint } from '../2_1/custom-point';
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import IdentifyParameters from "@arcgis/core/rest/support/IdentifyParameters.js";
import * as identify from "@arcgis/core/rest/identify.js";
import { Message } from 'primeng/api';

@Component({
    selector:'map-assignmnet2',
    templateUrl: './map-assignment2.component.html',
    styleUrls: ["./map-assignment2.component.scss"]
})
export class MapAssign2Component implements OnInit{
    @ViewChild('mapPanel', { static: true }) mapPanel!: ElementRef;
    @Output() coordinate:EventEmitter<CustomPoint> = new EventEmitter<CustomPoint>()
    messages!: Message[]
    map: Map | null = null;
    mapView: MapView | null = null;
    point: Point | null = null;
    marker: SimpleMarkerSymbol | null = null;
    pointGraphic: Graphic | null = null;
    customPoint :CustomPoint = new CustomPoint
    stateOutline!: Graphic;
    ngOnInit() {
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

        if (this.mapView) {
          const mapPanel = document.getElementById("mapPanel");
          if (mapPanel) {
            mapPanel.style.cursor = "wait";
          }
          const params = new IdentifyParameters();
          const identifyURL = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer";
          params.tolerance = 3;
          params.layerIds = [3];
          params.width = this.mapView.width;
          params.height = this.mapView.height;
          params.geometry = event.mapPoint;
          params.mapExtent = this.mapView.extent;
          params.returnGeometry = true;
          identify
              .identify(identifyURL, params)
              .then(function (response) {
                const results = response.results;
                
                return results.map(function (result:any) {
                  let feature = result.feature;
                  let layerName = result.layerName;
                  feature.attributes.layerName = layerName;
                  if (layerName === "states") {
                    feature.popupTemplate = {
                      // autocasts as new PopupTemplate()
                      title: "{STATE_NAME}",
                      content:
                        "<b>Population (2007):</b> {POP2007}" +
                        "<br><b>Area:</b> {Shape_Area}"
                    };
                  } 
                  return feature;
                });
              })
              .then((response) => {
                console.log(response)
                this.mapView?.openPopup({
                  features: response,
                  location: event.mapPoint
                })
                this.mapView?.graphics.remove(this.stateOutline);
                const stateGeometry = response[0].geometry;
                this.stateOutline = new Graphic({
                    geometry: stateGeometry,
                    symbol: 
                    {
                        type: 'simple-fill',
                        color: [255, 165, 0, 0.5]
                    } as __esri.SimpleFillSymbolProperties 
                });
                this.mapView?.graphics.add(this.stateOutline);
                if (mapPanel) {
                  mapPanel.style.cursor = "auto";
                }
              })
        }
      });
      this.map.add(layer);  
    }

    showMessage(detail: string): void {
      this.messages = [{ severity: 'warn', summary: 'เกิดข้อผิดพลาด', detail }];
      setTimeout(() => this.messages = [], 5000);
    } 

    handleLocate(event: CustomPoint) {
      if (event.longitude && this.mapView && event.latitude) {
        if (event.longitude <= -180 || event.longitude >= 180) {
          this.showMessage('Longitude ไม่ควรเกิน -180 และ 180 องศา');
          return
        }
        if (event.latitude <= -90 || event.latitude >= 90) {
          this.showMessage('Latitude ไม่ควรเกิน -90 และ 90 องศา');
          return
        }
        this.mapView?.graphics.removeAll()
        const newCenter = new Point({
          longitude: event.longitude,
          latitude: event.latitude,
        });
        this.marker = new SimpleMarkerSymbol({
          color: [226, 119, 40],
          outline: {
              color: [255, 255, 255],
              width: 2,
          },
        });
        this.pointGraphic = new Graphic({
          geometry: newCenter,
          symbol: this.marker,
        });
        this.mapView?.graphics.add(this.pointGraphic);
        this.mapView?.goTo(newCenter);
        }
    }
}