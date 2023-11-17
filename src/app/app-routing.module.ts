import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResponsiveColorComponent } from './Beginner/1_1/responsive-color.component';
import { PetInformationComponent } from './Beginner/1_2/pet-information.component';
import { CommentSimulationComponent } from './Beginner/1_3/comment-simulation.component';
import { LocatorComponent } from './Beginner/2_1/locator.component';
import { MapComponent } from './Beginner/3_1/map.component';
import { FirstComponent } from './index/first.component';
import { HeadLocatorComponent } from './Beginner/2/parent-locator.component';
import { MapAssign2Component } from './Beginner/4_1/map-assignment2.component';
import { QueryTaskComponent } from './Intermediate/Assignment1/query-task.component';
import { ClosestFacilityComponent } from './Intermediate/Assignment2/closest-facility.component';
import { RouteMapComponent } from './Intermediate/Assignment4/route-map.component';

const routes: Routes = [
  { path:'' , component: FirstComponent},
  { path:'beginner/1-1', component: ResponsiveColorComponent },
  { path:'beginner/1-2', component: PetInformationComponent },
  { path:'beginner/1-3', component: CommentSimulationComponent },
  { path:'beginner/2' , component: HeadLocatorComponent},
  { path:'beginner/2-1' , component: LocatorComponent},
  { path:'beginner/3-1' , component: MapComponent},
  { path:'beginner/4-1' , component: MapAssign2Component},
  { path:'intermediate/assignment1', component: QueryTaskComponent},
  { path:'intermediate/assignment2', component: ClosestFacilityComponent},
  { path:'intermediate/assignment4', component: RouteMapComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
