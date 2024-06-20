import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Timestamp } from 'rxjs';
import { Machine } from 'src/app/models';
import { BackService } from 'src/app/services/back.service';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.css']
})
export class MachinesComponent implements OnInit {

  machineList: Machine[]=[];
  machineList2: Machine[]=[];
  show: boolean = false;
  start: boolean = false;
  stop: boolean = false;
  restart: boolean = false;
  search: boolean = false;
  destroy: boolean = false;
  message: string = '';
  name: string = '';
  timestamp: string = '';
  machineName: string = '';
  dateFrom: string = '';
  dateTo: string = '';
  status: string [] = [];
  machineName1: string = '';
  dateFrom1: string = '';
  dateTo1: string = '';
  status1: string [] = [];
  errorString: string[] = [];
  running: boolean = false;
  stopped: boolean = false;
  searchFlag: boolean = false;
  errorsExists: boolean = false;

  constructor(private configService: ConfigService, private backService: BackService, private router: Router) { }

  ngOnInit(): void {
    this.backService.loadMachines().subscribe(machineList =>{
      this.machineList = []
      this.machineList = machineList;
      console.log(this.searchFlag+" else")
  });
    
    this.backService.loadMachines().subscribe(machineList =>{
      this.machineList = machineList;
      this.show = true;
      console.log(this.machineList)
    },err =>{
      this.show = false;
      this.message = 'You dont have permission to see the table!'
    });
    
    var permissions = JSON.parse(localStorage.getItem('permission') || '{}') 
    this.backService.loadMachines().subscribe(machineList2 =>{
      this.machineList2 = machineList2;
    });
    for(var a in permissions){
      console.log(permissions[a])
      if(permissions[a].permissionName === 'can_search_machines'){
        this.search = true;
      }if(permissions[a].permissionName === 'can_start_machines'){
        this.start = true;
      }if(permissions[a].permissionName === 'can_stop_machines'){
        this.stop = true;
      }if(permissions[a].permissionName === 'can_restart_machines'){
        this.restart = true;
      }if(permissions[a].permissionName === 'can_destroy_machines'){
        this.destroy = true;
      }
    }
    console.log(this.search)
    console.log(permissions[0])
  }
  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  searchMachines(): void{
    this.status = []
    if(this.stopped == false && this.running == false && this.machineName =='' && this.dateFrom ==''  && this.dateTo == ''){
      this.searchFlag =false;
    }else{
      this.machineName1= this.machineName;
      this.dateFrom1 = this.dateFrom;
      this.dateTo1 = this.dateTo;
      this.status1 = this.status;
      this.searchFlag = true;
    }
    if(this.running == true){
      this.status.push('RUNNING');
    }if(this.stopped == true){
      this.status.push('STOPPED');
    }

    this.backService.searchMachine(this.machineName,this.status,new Date(this.dateFrom),new Date(this.dateTo)).subscribe(machines =>{
      console.log(machines)
    });
    
  }

  startMachine(machineId: number): void{
    this.backService.startMachine(machineId).subscribe(machineId =>{
      console.log("Starting machine")
      this.backService.loadMachines().subscribe(machineList =>{
        this.machineList = machineList;
      });
      this.sleep(5000).then(()=>{
      });
    });
    
  }

  stopMachine(machineId: number): void{
    this.backService.stopMachine(machineId).subscribe(machineId =>{
      this.backService.loadMachines().subscribe(machineList =>{
        this.machineList = machineList;
      });
      this.sleep(3000).then(()=>{
        });
      });
  }

  restartMachine(machineId: number): void{
    var timestamp = document.querySelector('input')?.value;
    console.log(timestamp)
    
    this.backService.restartMachine(machineId).subscribe(machineId =>{  
      this.backService.loadMachines().subscribe(machineList =>{
        this.machineList = machineList;
      });
      this.sleep(8000).then(()=>{
      });
    });
  }
  
  
  destroyMachine(machineId: number): void{
    
    this.backService.destroyMachine(machineId).subscribe(machineId =>{
      this.backService.loadMachines().subscribe(machineList =>{
        this.machineList = machineList;
        this.machineList2 = machineList;
      });
    });
    
  }
}
