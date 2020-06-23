import {Inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, UrlSegment} from "@angular/router";
import {tokenNotExpired} from "angular2-jwt";
import {Observable} from "rxjs";



@Injectable({
  providedIn: 'root'
})

export class AuthGuardService implements CanActivate {
  constructor(public router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('token');
    const role = route.data.role
    if (!token || !tokenNotExpired()) {
      this.router.navigate(['/login']);
      return false;
    }
    if (role.indexOf(JSON.parse(localStorage.getItem('user')).role) === -1) {
      this.router.navigate(['/noaccess']);
    }
    return true;
  }

}
