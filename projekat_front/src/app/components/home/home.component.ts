import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Permission, User } from 'src/app/models';
import { BackService } from 'src/app/services/back.service';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  usersList: User[] = [];
  show: boolean = false;
  updateAuth: boolean = false;
  deleteAuth: boolean = false;
  perm: Permission[] = [];
  user: User[] =[]
  message: string = '';

  constructor(private configService: ConfigService, private backService: BackService, private router: Router) { 
  }
  setToken() {
    
  }

  ngOnInit(): void {
    this.canEdit();
    this.canDelete();
    this.backService.getUsers().subscribe(users =>{
      this.usersList = users;
      this.show = true;
      console.log(this.usersList)
    }, err => {
      this.show = false;
      this.message = 'You dont have permission to see the table!'
      console.log("no permission")
    });

    if(Object.keys(this.backService.getPermissions()).length === 0){
      alert('you dont have any permissions')
    }
    
    
  }
 
  canDelete(){
    
    this.backService.getPermissions().subscribe(perm=>{
      this.perm = perm;
      this.configService.setPermissions(perm);
      console.log(this.perm);
      for(let p of this.perm){
        console.log(p.permissionName)
        if(p.permissionName == ('can_delete_users')){
          this.deleteAuth = true
          break;
        }
      }
      console.log(this.deleteAuth)
      return this.deleteAuth;
      
    });
  }

  deleteUser(userId: number): void{
    console.log('poggers')
    this.backService.deleteUser(userId).subscribe(userId =>{
      console.log(userId);
    });
    console.log(userId)
    window.location.reload();
  }

  canEdit(){
    this.backService.getPermissions().subscribe(perm=>{
      this.perm = perm;
      this.configService.setPermissions(perm);
      console.log(this.perm);
      for(let p of this.perm){
        console.log(p.permissionName)
        if(p.permissionName == ('can_update_users')){
          this.updateAuth = true
          break;
        }
      }
      console.log(this.updateAuth)
      return this.updateAuth;
      
    });
  }
  editUser(userId: number): void{
    this.backService.getUpdateUser(userId).subscribe(user =>{
      console.log(user + " edit button Home")
      this.user.push(user);
      console.log(this.user)
      this.configService.setEditUser(this.user);
      this.router.navigate(['update'])
    })
  }

}
