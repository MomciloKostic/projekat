import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Permission, User } from 'src/app/models';
import { BackService } from 'src/app/services/back.service';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {

  userId: number= -1;
  name: string= '';
  lastName: string= '';
  email: string= '';
  password: string = '';
  read: boolean = false;
  create: boolean = false;
  update: boolean = false;
  delete: boolean = false;
  start: boolean = false;
  stop: boolean = false;
  restart: boolean = false;
  search: boolean = false;
  destroy: boolean = false;
  createMachine: boolean = false;
  permissions: Array<string> = []
  errorsExists: boolean=false;
  errorString: string[] = [];
  user: User[] =[]
  
  
  constructor(private configService: ConfigService, private backService: BackService,private router: Router){
   }

  async ngOnInit(): Promise<void> {
    await this.configService.getEditUser();
    this.fillData(this.configService.getEditUser())
  }

  async fillData(user: User[]){
    
    console.log(this.user[0] + ' pre funkcije')
    console.log(this.configService.getEditUser() + ' posle funkcije')
    this.name = user[0].name;
    this.lastName = user[0].lastName;
    this.email = user[0].email;
    this.password = user[0].password
    this.userId = user[0].userId
    for(let p of user[0].permissions){
      if(p.permissionName == 'can_read_users'){
        this.read = true;}
      if(p.permissionName == 'can_create_users'){
        this.create = true;}
      if(p.permissionName == 'can_update_users'){
        this.update = true;}
      if(p.permissionName == 'can_delete_users'){
        this.delete = true;}
      if(p.permissionName == 'can_start_machines'){
        this.start = true;}
      if(p.permissionName == 'can_stop_machines'){
        this.stop = true;}
      if(p.permissionName == 'can_restart_machines'){
      this.restart = true;}
      if(p.permissionName == 'can_search_machines'){
        this.search = true;}
      if(p.permissionName == 'can_destroy_machines'){
        this.destroy = true;}
      if(p.permissionName == 'can_create_machines'){
        this.createMachine = true;}
    }
    
  }

  updateUser(): void{
    this.errorString=[];
    this.errorsExists=false;
    if(this.email==="" || this.password==="" || this.name ==="" || this.lastName === "")
    {
      this.errorString.push("Morate popuniti sva polja!");
      this.errorsExists=true;
    }
    if(this.read) this.permissions.push('can_read_users');
    if(this.create) this.permissions.push('can_create_users');
    if(this.update) this.permissions.push('can_update_users');
    if(this.delete) this.permissions.push('can_delete_users');

    if(this.start) this.permissions.push('can_start_machines');
    if(this.stop) this.permissions.push('can_stop_machines');
    if(this.restart) this.permissions.push('can_restart_machines');
    if(this.search) this.permissions.push('can_search_machines');
    if(this.destroy) this.permissions.push('can_destroy_machines');
    if(this.createMachine) this.permissions.push('can_create_machines');

    if(!this.errorsExists){
      this.backService.updateUser(this.userId,this.name,this.lastName, this.email,this.password, this.permissions).subscribe(res => {
        if(res){
          console.log(res);
          this.router.navigate(['/'])
        }
      }, err =>{
        this.errorString = []
        this.errorString.push("Doslo je do greske.")
        this.errorsExists=true;
        console.log(err.status)
      })
    }
   console.log(this.configService.getEditUser());
  }
}
