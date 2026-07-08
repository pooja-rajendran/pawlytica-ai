import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
 providedIn:'root'
})
export class AuthService {


 constructor(
  private http:HttpClient
 ){}


login(data:any){

 return this.http.post(

  'http://localhost:3000/login',

  data

 );

}

logout(){

 localStorage.removeItem('token');

}


register(data:any){

 return this.http.post(

  'http://localhost:3000/register',

  data

 );

}


saveToken(token:string){

 localStorage.setItem(
  'token',
  token
 );

}


getToken(){

 return localStorage.getItem(
  'token'
 );

}

}