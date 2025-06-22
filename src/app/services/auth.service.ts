import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

interface LocalStorageToken{
  expiry:number,
  name:string,
  id:string,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthentic:BehaviorSubject<boolean>;
  userName:BehaviorSubject<string>;
  userId:BehaviorSubject<string>;
  constructor(){
    const localStorageToken=JSON.parse(localStorage.getItem('token')||"{}");
    this.isAuthentic=new BehaviorSubject<boolean>(Object.keys(localStorageToken).length!==0&&localStorageToken.expiry>=Date.now());
    this.userName=new BehaviorSubject<string>(localStorageToken.name||'Guest');
    this.userId=new BehaviorSubject<string>(localStorageToken.id||'6853b832b666a32da1be3746');  //this is guest account id
  }
}
