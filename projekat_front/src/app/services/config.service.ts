import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Permission, User } from '../models';
import { BackService } from './back.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private token: string;
  private userPerm: Permission[];
  private user: User[];

  constructor() { 
    this.token = '';
    this.userPerm = [];
    this.user = [];
  }

  setToken(token: string): void{
    this.token = token;
    localStorage.setItem('token', this.token);
  }

  getToken(): string {
    if(localStorage.getItem('token')){
      this.token = localStorage.getItem('token') || '{}';
      return this.token;
    }else{
      console.log('null token')
      return this.token;
    }
  }
  setPermissions(userPerm: Permission[]){
    this.userPerm = userPerm;
    localStorage.setItem('permission', JSON.stringify(this.userPerm))
  }

  getPermissions(): Permission[]{
    return this.userPerm;
  }

  setEditUser(user: User[]){
    this.user =user
  }

  getEditUser(): User[]{
    return this.user;
  }
  


}
