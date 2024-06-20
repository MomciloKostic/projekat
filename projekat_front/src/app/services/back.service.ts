import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Timestamp } from 'rxjs';
import {environment} from "../../environments/environment";
import { CreateMachine, Jwt, Machine, Permission, Status, User } from '../models';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class BackService {

  private readonly apiUrl = environment.domaci3Api;


  constructor(private httpClient: HttpClient, private configService: ConfigService) {
  }

  public getUpdateUser(userId: number): Observable<User>{
    return this.httpClient.get<User>(`${this.apiUrl}api/user/${userId}`, {headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
  }
  public getPermissions(): Observable<Permission[]>{
    return this.httpClient.get<Permission[]>(`${this.apiUrl}api/permissions`, {headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
  }

  public getUsers(): Observable<User[]>{
    return this.httpClient.get<User[]>(`${this.apiUrl}api/loadUsers`, {headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
  }

  public login(email: string, password: string){
    return this.httpClient.post<Jwt>(`${this.apiUrl}auth/login`, {email: email, password: password});
  }

  
  public deleteUser(userId: number): Observable<User>{

    return this.httpClient.delete<User>(`${this.apiUrl}api/deleteUser/${userId}`, {headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
  }

  public updateUser(userId: number, name: string, lastName: string, email: string, password: string, permissions: Array<string>): Observable<User>{

    return this.httpClient.put<User>(`${this.apiUrl}api/update`,{ userId,name,lastName,email,password,permissions },{headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
  }

  public createUser(name: string, lastName: string, email: string, password: string, permissions: Array<string>): Observable<User>{

    return this.httpClient.post<User>(`${this.apiUrl}api/create`,{ name,lastName,email,password,permissions },{headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
  }
 
  public createMachine(name: string): Observable<CreateMachine>{
    return this.httpClient.post<CreateMachine>(`${this.apiUrl}api/machine/create`,{ name },{headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});;
  }

  public loadMachines(): Observable<Machine[]>{
    return this.httpClient.get<Machine[]>(`${this.apiUrl}api/machine/loadMachines`,{headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});;
  }

  public startMachine(machineId: number): Observable<Machine>{
    return this.httpClient.put<Machine>(`${this.apiUrl}api/machine/start/${machineId}`,{ machineId },{headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
  }
  public stopMachine(machineId: number): Observable<Machine>{
    return this.httpClient.put<Machine>(`${this.apiUrl}api/machine/stop/${machineId}`,{ machineId },{headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
  }
  public restartMachine(machineId: number): Observable<Machine>{
    return this.httpClient.put<Machine>(`${this.apiUrl}api/machine/restart/${machineId}`,{ machineId },{headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
  }

  public scheduleMachine(operation: string, machineId: number, scheduleDate: Date): Observable<Machine>{
    return this.httpClient.put<Machine>(`${this.apiUrl}api/machine/schedule`,{ operation, machineId, scheduleDate },{headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
  }
  public destroyMachine(machineId: number): Observable<Machine>{
    return this.httpClient.put<Machine>(`${this.apiUrl}api/machine/destroy/${machineId}`,{ machineId },{headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
  }

  public searchMachine(name: string, status: string[], dateFrom: Date, dateTo: Date): Observable<Machine[]>{
    return this.httpClient.post<Machine[]>(`${this.apiUrl}api/machine/search`,{ name, status, dateFrom, dateTo },{headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
  }
  
}
