import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate():
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {

    let loginFlag = false;

    this.authService.isAuthentic.subscribe(isAuthentic=>loginFlag = isAuthentic)

    if (loginFlag) {
      return true;
    } else {
      return this.router.parseUrl('/');
    }
  }
}