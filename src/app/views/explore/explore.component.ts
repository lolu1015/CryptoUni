import {Component, OnInit} from '@angular/core';
import {TimetableComponent} from "../timetable/timetable.component";


@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})

export class ExploreComponent implements OnInit {
  searchString = ''
  dummyModules = [
    {
      module: "Software Engineering",
      name: 'SWE'
    },
    {
      module: "Software Engineering",
      name: 'SWA'
    },
    {
      module: "Operations Research",
      name: 'OR'
    },
    {
      module: "Data",
      name: 'Data Mining'
    },
    {
      module: "Data",
      name: 'Data Analytics'
    },
    {
      module: "Data",
      name: 'Big Data'
    },
  ]
  constructor(private timeTable: TimetableComponent) { }

  ngOnInit(): void {
    this.searchString = this.timeTable.setString()
  }

  filteredModules() {
    if (this.searchString.length === 0)
      return []
    else
      return this.dummyModules.filter(mod => mod.module.toLowerCase().includes(this.searchString.toLowerCase()) || mod.name.toLowerCase().includes(this.searchString.toLowerCase()));
  }
}
