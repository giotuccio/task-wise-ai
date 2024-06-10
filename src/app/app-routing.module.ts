import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeCalendarComponent } from './employee-calendar/employee-calendar.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard'; // Import your AuthGuard
import { TaskDetailsDialogComponent } from './task-details-dialog/task-details-dialog.component';
import { JoeyAiComponent } from './joey-ai/joey-ai.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    // canActivate: [AuthGuard] 
  },
  { 
    path: 'joey', 
    component: JoeyAiComponent, 
    // canActivate: [AuthGuard] 
  },
  { path: 'task-details/:id', component: TaskDetailsDialogComponent },
  { 
    path: 'employee-calendar', 
    component: EmployeeCalendarComponent, 
    // canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login by default
  { path: '**', redirectTo: '/login' } // Redirect to login for any other route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
