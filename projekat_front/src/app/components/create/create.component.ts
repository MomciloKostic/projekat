import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Permission } from 'src/app/models';
import { BackService } from 'src/app/services/back.service';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  name: string= '';
  lastName: string= '';
  password: string = '';
  email: string= '';
  read: boolean = false;
  create: boolean = false;
  update: boolean = false;
  delete: boolean = false;
  errorsExists: boolean=false;
  start: boolean = false;
  stop: boolean = false;
  restart: boolean = false;
  search: boolean = false;
  destroy: boolean = false;
  createMachine: boolean = false;
  errorString: string[] = [];
  permissions: Array<string> = [];

  constructor(private configService: ConfigService, private backService: BackService,private router: Router) { }

  ngOnInit(): void {
  }

  createUser(): void{
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
      this.backService.createUser(this.name,this.lastName, this.email,this.password, this.permissions).subscribe(res => {
        if(res){
          console.log(res);
          this.router.navigate(['/'])
        }
      }, err =>{
        this.errorString = []
        this.errorString.push("Korisnik vec postoji!")
        this.errorsExists=true;
        console.log(err.status)
      })
    }
  }

}
