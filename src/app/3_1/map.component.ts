import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import Graphic from '@arcgis/core/Graphic';
import { CustomPoint } from '../2_1/custom-point';
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import { Message } from 'primeng/api';

@Component({
  selector: 'map-app',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild('mapPanel', { static: true }) mapPanel!: ElementRef;
  messages!: Message[]
  map: Map | null = null;
  mapView: MapView | null = null;
  point: Point | null = null;
  marker: SimpleMarkerSymbol | null = null;
  pointGraphic: Graphic | null = null;

  ngOnInit() {
    const layer = new MapImageLayer({
      url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Water_Network/MapServer/',
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

    this.point = new Point({
      longitude: 100.5441,
      latitude: 13.7034348,
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
