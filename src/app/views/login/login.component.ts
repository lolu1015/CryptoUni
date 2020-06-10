import {Component, Injectable, OnInit} from '@angular/core';
import {Router} from "@angular/router"
import { SHA256, enc } from "crypto-js";
import {DatabaseService} from "../../service";

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
  routeTo = '/login'
  displayWrongPassword = false

  constructor(private service: DatabaseService, private router: Router) { }

  ngOnInit(): void {
    this.test()
  }

  login() {

    this.service.login(this.username, SHA256(this.password).toString(enc.Hex)).subscribe(data => {
      if(data.status === 200) {
        signedIn = true;
        currentName = this.username;
        this.displayWrongPassword = false
        this.router.navigate(['/home'])
      } else {
        signedIn = false
        this.displayWrongPassword = true
        this.router.navigate(['/login'])
      }
    }, error => {
      console.log("error")
      this.displayWrongPassword = true
      this.router.navigate(['/login'])
    })
  }


  test() {
    console.log("HASH")
    console.log(SHA256("Test").toString(enc.Hex));
    console.log("HASH")
  }










  isLoggedIn() {
    return signedIn;
  }

  logout() {
    signedIn = false;
  }

  getId() {
    console.log("currentNamE??? " + currentName)
    return currentName;
  }
}
