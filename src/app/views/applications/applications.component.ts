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
      let json = JSON.parse(items.body)
      localStorage.setItem('user', JSON.stringify(json.user))
      this.data = json.appl
    })
  }

}
