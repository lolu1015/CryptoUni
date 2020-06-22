/* tslint:disable */
import { Component, OnInit } from '@angular/core';
import {DatabaseService} from "../../service";

@Component({
  selector: 'app-studies-overview',
  templateUrl: './studies-overview.component.html',
  styleUrls: ['./studies-overview.component.css']
})
export class StudiesOverviewComponent implements OnInit {

  modules = []
  takenCourses = []
  newModule = ""
  newDescription = ""
  newModuleName = ""
  newModuleModule = ""
  showPDF = false
  modulHandbuch

  constructor(private service: DatabaseService) { }

  ngOnInit(): void {
    console.log(JSON.parse(localStorage.getItem('user'))['id'])
    this.service.getSuggestions(JSON.parse(localStorage.getItem('user'))['id']).subscribe((res: []) => {
      console.log(JSON.stringify(res))
      res.forEach((m: any) => {
        console.log(m.name)
        this.modules.push(m)
      })
    })
    this.takenCourses = JSON.parse(localStorage.getItem('user')).currentModules
  }

  show(event) {
    this.newModule = this.modules.filter(module => module.name === event.name)[0].id
    this.newDescription = this.modules.filter(module => module.name === event.name)[0].description
    this.newModuleName = this.modules.filter(module => module.name === event.name)[0].name
    this.newModuleModule = this.modules.filter(module => module.name === event.name)[0].module
    this.service.getPDF(this.newModule).subscribe((data) => {
      this.modulHandbuch = data
      //needed to force reload to trigger loading of pdf viewer
      this.showPDF ? this.showPDF = false : true;
    })
  }

  setModule() {
    localStorage.setItem('searchString', this.newModuleModule)
  }
}
