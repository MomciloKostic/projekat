import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackService } from 'src/app/services/back.service';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-create-machine',
  templateUrl: './create-machine.component.html',
  styleUrls: ['./create-machine.component.css']
})
export class CreateMachineComponent implements OnInit {

  machineName: string= "";
  errorString: string[] = [];
  errorsExists: boolean=false;

  constructor(private configService: ConfigService, private backService: BackService,private router: Router) { }

  ngOnInit(): void {
  }


  createMachine(): void{
    this.errorString=[];
    this.errorsExists=false;
    if(this.machineName ==="" )
    {
      this.errorString.push("Ime ne sme biti prazno!");
      this.errorsExists=true;
    }

    if(!this.errorsExists){
      this.backService.createMachine(this.machineName).subscribe(res => {
        if(res){
          alert('Succesfuly created '+this.machineName)
          console.log(res);
          this.router.navigate(['/machines'])
        }
      }, err =>{
        this.errorString = []
        this.errorString.push("Error!")
        this.errorsExists=true;
        console.log(err.status)
      })
    }
  }
}
