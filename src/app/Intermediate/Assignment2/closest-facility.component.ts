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
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol.js";

@Component({
    selector:'closest-facility',
    templateUrl: './closest-facility.component.html',
    styleUrls: ['./closest-facility.component.scss']
})
export class ClosestFacilityComponent implements OnInit{
    @ViewChild('mapPanel', { static: true }) mapPanel!: ElementRef;
    @Output() coordinate:EventEmitter<CustomPoint> = new EventEmitter<CustomPoint>()
    map: Map | null = null;
    mapView: MapView | null = null;
    point: Point | null = null;
    marker!: SimpleMarkerSymbol
    pointGraphic!: Graphic ;
    placePoint: Graphic[] = [];
    customPoint :CustomPoint = new CustomPoint
    messages!: Message[]
    bufferGraphic!:Graphic;
    closestInfo!:any;
    drawPath!: Graphic;
    drawAllPath:Graphic[] = [];
    stateClosest: boolean = false;
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
        center: [-117.117, 32.70781494080129], // [longitude, latitude]
        zoom: 15,
      });
  
      this.point = new Point({
        longitude: -117.117,
        latitude: 32.70781494080129,
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
        this.drawAllPath.forEach((path) => {
            this.mapView?.graphics.remove(path);
        })
        const mapPanel = document.getElementById("mapPanel");
        if (mapPanel) {
          mapPanel.style.cursor = "wait";
        }
        this.mapView?.graphics.remove(this.drawPath);
        this.placePoint.forEach((point) => {
          this.mapView?.graphics.remove(point)
        })
        this.placePoint = [];
        this.customPoint = {longitude:event.mapPoint.longitude , latitude:event.mapPoint.latitude}
        this.coordinate.emit(this.customPoint)
        
        this.mapView?.graphics.remove(this.pointGraphic);
        this.point = new Point({
          longitude:event.mapPoint.longitude, 
          latitude:event.mapPoint.latitude
        });
        const newMark = new SimpleMarkerSymbol({
          color: [226, 119, 40],
          outline: {
            color: [0, 0, 0],
            width: 1,
          },
        })
        this.pointGraphic = new Graphic({
          geometry: this.point,
          symbol: newMark,
        });
        this.mapView?.graphics.remove(this.bufferGraphic);
        const bufferGeometry = geometryEngine.buffer(event.mapPoint, 20, 'kilometers');
        const filledColor:SimpleFillSymbol = new SimpleFillSymbol({
            color: [236, 143, 94, 0.5],
        })
        this.bufferGraphic = new Graphic({
            geometry: bufferGeometry as Polygon,
            symbol: filledColor
        })
        const citiesLayer = new FeatureLayer({
          url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0'
        });
        const query = citiesLayer.createQuery();
        query.geometry = bufferGeometry as Polygon;
        query.spatialRelationship = 'intersects';
        query.returnGeometry = true;
        
        citiesLayer.queryFeatures(query).then((response:any) => {
          response.features.forEach((res:any,i:number) => {
            this.point = new Point({
              longitude:res.geometry.longitude, 
              latitude:res.geometry.latitude
            });
            const placeMark = new SimpleMarkerSymbol({
              color: [0, 160, 40],
              outline: {
                color: [0, 0, 0],
                width: 2,
              },
            })
            const placePoint = new Graphic({
              geometry: this.point,
              symbol: placeMark,
              attributes: {
                name: res.attributes.areaname
              }
            });
            this.placePoint.push(placePoint);
          })
          this.placePoint.forEach((point) => {
            this.mapView?.graphics.add(point)
          })
          this.mapView?.graphics.add(this.pointGraphic); // incident
          this.mapView?.graphics.add(this.bufferGraphic); // circle
          const closestFacilityURL = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/NetworkAnalysis/SanDiego/NAServer/ClosestFacility"
          const params =  new ClosestFacilityParameters({
            incidents: new FeatureSet({
              features: [this.pointGraphic],
            }),
            facilities: new FeatureSet({
              features: this.placePoint,
            }),
            returnRoutes: true,
            defaultTargetFacilityCount: 10,
            // outSpatialReference: new SpatialReference({ wkid: 102100 })
          })
          closestFacility.solve(closestFacilityURL,params)
          .then((res) => {
            console.log(res)
            this.closestInfo = res;
            this.stateClosest = true;
            res.routes.features.forEach((path:any) => {
              const pathToDestination = new Polyline({
                paths: path.geometry.paths
              })
              const line = new SimpleLineSymbol({
                color: "cyan",
                width: "0.5px",
                style: "solid",
              });
              const drawPath = new Graphic({
                geometry: pathToDestination,
                symbol: line
              })
              this.drawAllPath.push(drawPath);
            })
            this.drawAllPath.forEach((data) => {
              this.mapView?.graphics.add(data);
            })
            if (mapPanel) {
              mapPanel.style.cursor = "auto";
            }
          })
        });
      });
      this.map.add(layer);
    }

    close() {
      this.closestInfo.routes.features.forEach((i:any) => {
        i.clicked = false;
      })
      this.mapView?.graphics.remove(this.drawPath);
      this.mapView?.graphics.remove(this.bufferGraphic);
      this.placePoint.forEach((point) => {
        this.mapView?.graphics.remove(point)
      })
      this.drawAllPath.forEach((path) => {
        this.mapView?.graphics.remove(path)
      })
      this.stateClosest = false;
    }

    rowClick(data:any) {
      this.closestInfo.routes.features.forEach((i:any) => {
        i.clicked = false;
      })
      data.clicked = true;
      this.mapView?.graphics.remove(this.drawPath);
      const pathToDestination = new Polyline({
        paths: data.geometry.paths
      })
      this.drawPath = new Graphic({
        geometry: pathToDestination,
        symbol: {
          color: [0, 0, 0]
        }
      })
      this.mapView?.graphics.add(this.drawPath);
    }
}