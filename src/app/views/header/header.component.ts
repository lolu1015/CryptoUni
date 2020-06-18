import { Component, OnInit } from '@angular/core';
import {LoginComponent} from '../login/login.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  username = ''

  constructor(private loginService: LoginComponent) { }

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

}
