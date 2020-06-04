import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './views/home/home.component';
import {LoginComponent} from './views/login/login.component';
import {StudiesOverviewComponent} from './views/studies-overview/studies-overview.component';
import {TimetableComponent} from './views/timetable/timetable.component';
import {TakenCoursesComponent} from './views/taken-courses/taken-courses.component';
import {ExploreComponent} from "./views/explore/explore.component";


const routes: Routes = [{path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'studiesoverview', component: StudiesOverviewComponent},
  {path: 'timetable', component: TimetableComponent},
  {path: 'takencourses', component: TakenCoursesComponent},
  {path: 'explore', component: ExploreComponent}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
