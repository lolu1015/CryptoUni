/* tslint:disable */
import { Component, OnInit } from '@angular/core';
import {LoginComponent} from '../login/login.component';
import {DatabaseService} from "../../service";
const XLSX = require('xlsx');
const FileSaver = require('file-saver');



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  username = ''

  constructor(private loginService: LoginComponent, private service: DatabaseService) { }

  ngOnInit(): void {
  }

  isLoggedIn() {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    return true;
  }

  isAdmin() {
    if (JSON.parse(localStorage.getItem('user')).role === 'admin') {
      return true
    } else {
      return false
    }
  }

  logout() {
    this.loginService.logout();
  }

  getName() {
    return localStorage.getItem('username')
  }

  getUserData() {
    this.service.getUserData(JSON.parse(localStorage.getItem('user'))['id']).subscribe(res => {

      console.log(res)


      let json = JSON.parse(res)
      const wb = XLSX.utils.book_new();
      wb.Props = {
        Title: "Your Data",
        Subject: "Crypto Copy User Data",
        Author: "Crypto Copy",
      };


      wb.SheetNames.push("Userdata");
      var userdata = [];
      userdata.push(['ID', 'Name'])
      userdata.push([json.user.id, json.user.name])
      userdata.push(['Besuchte Module'])

      console.log(json.user.modules)


      json.user.modules.forEach(mod => {
        userdata.push([mod.name, mod.id, mod.professor, mod.description])
      })
      userdata.push(['Bewerbungen'])

      json.application.forEach(app => {
        userdata.push([app.id, app.status, app.module.name])
      })


      var ws_data = userdata;

      var ws = XLSX.utils.aoa_to_sheet(ws_data);

      wb.Sheets["Userdata"] = ws;

      var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
      function s2ab(s) {

        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;

      }
      if(FileSaver)
        FileSaver.saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'CryptoCopy.xlsx');
    })
  }



}
