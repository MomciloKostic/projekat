import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models';
import { BackService } from 'src/app/services/back.service';
import { ConfigService } from 'src/app/services/config.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';
  errorsExists: boolean=false;
  errorString: string[] = [];


  constructor(private configService: ConfigService, private backService: BackService,private router: Router) {
    
  }
  
  ngOnInit(): void {
  }
  
  login(): void{
    
    this.errorString=[];
    this.errorsExists=false;
    if(this.email==="" || this.password==="")
    {
      this.errorString.push("Morate popuniti sva polja!");
      this.errorsExists=true;
    }
    if(!this.errorsExists){
      this.backService.login(this.email,this.password).subscribe(res => {
        if(res){
          
          this.configService.setToken(res.jwt);
          console.log(localStorage.getItem('token'))
          this.backService.getPermissions().subscribe(perm=>{
          this.configService.setPermissions(perm);
            if((this.configService.getPermissions()).length === 0){
              console.log('asdaaaaaaaaaaaaaaaaaaaaaa' + this.configService.getPermissions()+"===============")
              alert('you dont have any permissions')
            }
          });

          
          window.location.reload();
          location.replace('/');
        }
      }, err =>{
        this.errorString = []
        this.errorString.push("Niste uneli dobro podatke!")
        this.errorsExists=true;
        console.log(err.status)
      })
    }
    
  }

}
