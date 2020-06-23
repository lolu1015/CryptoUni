import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './views/home/home.component';
import {LoginComponent} from './views/login/login.component';
import {StudiesOverviewComponent} from './views/studies-overview/studies-overview.component';
import {TimetableComponent} from './views/timetable/timetable.component';
import {TakenCoursesComponent} from './views/taken-courses/taken-courses.component';
import {ExploreComponent} from "./views/explore/explore.component";
import {AuthGuardService} from "../guards/auth-guard.service";
import {AccessdeniedComponent} from "./views/accessdenied/accessdenied.component";
import {ApplicationsComponent} from "./views/applications/applications.component";
import {ApplOverviewComponent} from "./views/appl-overview/appl-overview.component";


const routes: Routes = [{path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'studiesoverview', component: StudiesOverviewComponent},
  {path: 'timetable', component: TimetableComponent, canActivate: [AuthGuardService], data: {
      role: 'student'
    }},
  {path: 'takencourses', component: TakenCoursesComponent, canActivate: [AuthGuardService], data: {
      role: 'student'
    }},
  {path: 'explore', component: ExploreComponent, canActivate: [AuthGuardService], data: {
      role: ['student', 'admin']
    }},
  {path: 'applications', component: ApplicationsComponent, canActivate: [AuthGuardService], data: {
      role: 'student'
    }},
  {path: 'applOverview', component: ApplOverviewComponent, canActivate: [AuthGuardService], data: {
      role: 'admin'
    }},
  {path: 'noaccess', component: AccessdeniedComponent, canActivate: [AuthGuardService], data: {
      role: ['student', 'admin']
    }}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
