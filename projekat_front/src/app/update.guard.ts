import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfigService } from './services/config.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateGuard implements CanActivate {

  router: Router;
  updateFlag: boolean = false;

  constructor(router: Router , private configService: ConfigService){
    this.router = router;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    

      for(let p of this.configService.getPermissions()){
        if(p.permissionName == ("can_update_users")){
          this.updateFlag = true;
          return true;
        }
      }
      if(this.updateFlag != true){
        return this.updateFlag;
      }else {
        return this.updateFlag;
      }
  
    }
  
}
