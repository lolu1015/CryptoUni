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
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import { ChatModule } from '@progress/kendo-angular-conversational-ui';
import {ChatService} from "./views/explore/chat.service";
import {PdfViewerModule} from "ng2-pdf-viewer";
import {AuthGuardService} from "../guards/auth-guard.service";
import {TokenInterceptor} from "../guards/authInterceptor";
import { AccessdeniedComponent } from './views/accessdenied/accessdenied.component';
import { ApplicationsComponent } from './views/applications/applications.component';
import { ApplOverviewComponent } from './views/appl-overview/appl-overview.component';

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
    ExploreComponent,
    AccessdeniedComponent,
    ApplicationsComponent,
    ApplOverviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FullCalendarModule,
    HttpClientModule,
    ChatModule,
    PdfViewerModule
  ],
  providers: [ChatService, AuthGuardService, {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
