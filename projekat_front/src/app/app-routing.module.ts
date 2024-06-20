import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard'; 
import { CreateComponent } from './components/create/create.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { UpdateComponent } from './components/update/update.component';
import { CreateGuardGuard } from './create-guard.guard';
import { CreateMachineComponent } from './components/create-machine/create-machine.component';
import { MachinesComponent } from './components/machines/machines.component';
import { UpdateGuard } from './update.guard';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "create",
    component: CreateComponent,
    canActivate: [AuthGuard, CreateGuardGuard]
  },
  {
    path: "update",
    component: UpdateComponent,
    canActivate: [AuthGuard, UpdateGuard]
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "create_machine",
    component: CreateMachineComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "machines",
    component: MachinesComponent
    ,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
