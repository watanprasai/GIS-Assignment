import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommentSimulationComponent } from './Beginner/1_3/comment-simulation.component';
import { PetInformationComponent } from './Beginner/1_2/pet-information.component';
import { ResponsiveColorComponent } from './Beginner/1_1/responsive-color.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { LocatorComponent } from './Beginner/2_1/locator.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { MapComponent } from './Beginner/3_1/map.component';
import { FirstComponent } from './index/first.component';
import { HeadLocatorComponent } from './Beginner/2/parent-locator.component';
import { MapAssign2Component } from './Beginner/4_1/map-assignment2.component';
import { QueryTaskComponent } from './Intermediate/Assignment1/query-task.component';
import { MessagesModule } from 'primeng/messages';
import { ClosestFacilityComponent } from './Intermediate/Assignment2/closest-facility.component';

@NgModule({
  declarations: [
    AppComponent,
    CommentSimulationComponent,
    PetInformationComponent,
    ResponsiveColorComponent,
    LocatorComponent,
    MapComponent,
    FirstComponent,
    HeadLocatorComponent,
    MapAssign2Component,
    QueryTaskComponent,
    ClosestFacilityComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    InputNumberModule,
    MessagesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
