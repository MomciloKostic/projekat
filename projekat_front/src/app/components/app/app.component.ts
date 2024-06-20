import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Permission } from 'src/app/models';
import { BackService } from 'src/app/services/back.service';
import { ConfigService } from 'src/app/services/config.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  perm: Permission[] = [];

  flagCreate: boolean= false;
  create: boolean = false;
  search: boolean = false;
  constructor(private configService: ConfigService, private backService: BackService) {
  }
  ngOnInit(): void {
    var permissions = JSON.parse(localStorage.getItem('permission') || '{}') 
    for(var a in permissions){
      console.log(permissions[a])
      if(permissions[a].permissionName === 'can_create_machines'){
        this.create = true;
      }
      if(permissions[a].permissionName === 'can_search_machines'){
        this.search = true;
      }
    }
    this.checkPerm();
  }

  checkPerm(){
    this.backService.getPermissions().subscribe(perm=>{
      
      this.perm = perm;
      this.configService.setPermissions(perm);
      console.log("-------------  "+perm + "asdasfsdgaufhausdihsduifghasduh")
      console.log(this.perm);
      for(let p of this.perm){
        console.log(p.permissionName)
        if(p.permissionName == ("can_create_users")){
          this.flagCreate = true
        }
        if(p.permissionName === 'can_create_machines'){
          this.create = true;
        }
        if(p.permissionName === 'can_search_machines'){
          this.search = true;
        }
      }
      console.log(this.flagCreate)
      return this.flagCreate;
      
    });
    
  }
 
  getToken() {
    return this.configService.getToken();
  }
  isLoggedIn(){
    if(localStorage.getItem('token'))
      return true;
    else return false;
  }

  logout(){
    this.configService.setPermissions([]);
    localStorage.removeItem('token');
    localStorage.removeItem('permission');
    window.location.reload();
  }
}
