import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfigService } from './services/config.service';

@Injectable({
  providedIn: 'root'
})
export class CreateGuardGuard implements CanActivate {

  router: Router;
  flagCreate: boolean= false;
  constructor(router: Router , private configService: ConfigService){
    this.router = router;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    for(let p of this.configService.getPermissions()){
      if(p.permissionName == ("can_create_users")){
        this.flagCreate = true
        break;
      }
    }
    if(this.flagCreate != true){
      location.replace('/')
      return false
    }else return true;
  }
  
  
}
