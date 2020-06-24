import {Component, Injectable, OnInit} from '@angular/core';
import {Router} from "@angular/router"
import { SHA256, enc } from "crypto-js";
import {DatabaseService} from "../../service";
import {tokenNotExpired} from "angular2-jwt";


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
  displayWrongPassword = false

  constructor(private service: DatabaseService, private router: Router) { }

  ngOnInit(): void {
  }

  login() {

    this.service.login(this.username, SHA256(this.password).toString(enc.Hex)).subscribe(data => {
      if(data.status === 200) {
        let json = JSON.parse(data.body)
        localStorage.setItem('username', this.username)
        document.cookie = `token=${json.token}`
        localStorage.setItem('token', json.token);
        localStorage.setItem('user', JSON.stringify(json.user))
        this.displayWrongPassword = false
        this.router.navigate(['/home'])
      } else {
        this.displayWrongPassword = true
        this.router.navigate(['/login'])
      }
    }, error => {
      console.log("error")
      this.displayWrongPassword = true
      this.router.navigate(['/login'])
    })
  }

  logout() {
    document.cookie = undefined
    localStorage.setItem('token', "");
  }

  getId() {
    return localStorage.getItem('username');
  }

  tokenExpired() {
    if(localStorage.getItem('token') && !tokenNotExpired()) {
      return true
    } else if(!localStorage.getItem('token')) {
      return false
    }
    return false
  }
}
