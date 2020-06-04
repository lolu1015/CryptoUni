import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { ScheduleComponent } from './views/schedule/schedule.component';
import { FooterComponent } from './views/footer/footer.component';
import { HeaderComponent } from './views/header/header.component';
import { HomeComponent } from './views/home/home.component';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule} from "@angular/forms";
import { FullCalendarModule } from '@fullcalendar/angular';
import { StudiesOverviewComponent } from './views/studies-overview/studies-overview.component';
import { TakenCoursesComponent } from './views/taken-courses/taken-courses.component';
import { TimetableComponent } from './views/timetable/timetable.component';
import { ExploreComponent } from './views/explore/explore.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ScheduleComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    StudiesOverviewComponent,
    TakenCoursesComponent,
    TimetableComponent,
    ExploreComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FullCalendarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
