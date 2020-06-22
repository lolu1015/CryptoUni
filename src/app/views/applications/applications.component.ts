import { Component, OnInit } from '@angular/core';
import {DatabaseService} from "../../service";

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {

  data
  constructor(private service: DatabaseService) { }

  ngOnInit(): void {
    console.log(JSON.parse(localStorage.getItem('user')).id)
    this.service.getApplications(JSON.parse(localStorage.getItem('user'))['id']).subscribe(items => {
      console.log('ITEMS!  ' + items)
      console.log(JSON.stringify(items[0]))
      console.log('scc')
      console.log(JSON.stringify(items[1]))
      this.data = items
    })
  }

}
