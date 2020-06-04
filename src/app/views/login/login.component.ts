import {Component, Injectable, OnInit} from '@angular/core';

const user = 'test';
const password = 'test';
let signedIn = false
let currentName = '';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  password = ''
  username = ''
  routeTo = '/home'

  constructor() { }

  ngOnInit(): void {
  }

  login() {
    if (this.username === user && this.password === password) {
      signedIn = true;
      currentName = this.username;
    } else {
      signedIn = false;
    }
  }

  isLoggedIn() {
    return signedIn;
  }

  logout() {
    signedIn = false;
  }
}
