import { Component } from "@angular/core";
import { CustomPoint } from "../2_1/custom-point";

@Component({
    selector: 'head-locator',
    templateUrl: './parent-locator.component.html',
    styleUrls: ['./parent-locator.component.scss']
})
export class HeadLocatorComponent{
    handleLocate(event: CustomPoint) {
        console.log(event)
    }
}