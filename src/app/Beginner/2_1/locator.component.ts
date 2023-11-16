import { Component , OnInit , Input , Output , EventEmitter}  from "@angular/core";
import { CustomPoint } from "./custom-point";
@Component({
    selector: 'locator',
    templateUrl: './locator.component.html',
    styleUrls: ['./locator.component.scss']
})
export class LocatorComponent implements OnInit {
    customPoint :CustomPoint = new CustomPoint()
    @Input() 
    set coordinate(data:CustomPoint) {
        this.customPoint = data
    }
    get coordinate():CustomPoint {
        return this.customPoint
    }
    @Output() locate: EventEmitter<CustomPoint> = new EventEmitter<CustomPoint>();

    ngOnInit(): void {
        // console.log(this.customPoint)
    }

    onLocate () {
        this.locate.emit(this.customPoint)
    }
}