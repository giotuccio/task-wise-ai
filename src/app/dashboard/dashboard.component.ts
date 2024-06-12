import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { Task} from "../objects/task.model"; // Assuming you have a Task model
import { Project } from "../objects/project.model";
import { MatDialog } from "@angular/material/dialog";
import { ProjectDetailsDialogComponent } from "../project-details-dialog/project-details-dialog.component";
import { CreateTaskDialogComponent } from "../create-task-dialog/create-task-dialog.component";
import { Priority } from "../objects/priority.model";
import { MatSidenav } from "@angular/material/sidenav";
import { TaskDetailsDialogComponent } from "../task-details-dialog/task-details-dialog.component";
import { Status } from "../objects/status.model";
import { Campaign } from "../objects/campaign.model";
import { CampaignDetailsDialogComponent } from "../campaign-details-dialog/campaign-details-dialog.component";
import { CreateTaskwiseTaskComponent } from "../create-taskwise-task/create-taskwise-task.component";
import { CreateTaskwiseCampaignComponent } from "../create-taskwise-campaign/create-taskwise-campaign.component";
import { AskTaskwiseDialogComponent } from "../ask-taskwise-dialog/ask-taskwise-dialog.component";
import { UpdatePhotoDialogComponent } from "../update-photo-dialog/update-photo-dialog.component";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { TaskService } from "../services/task.service";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { CampaignServiceService } from "../services/campaign-service.service";
import { Employee } from "../objects/employee.model";
import { EmployeeService } from "../services/employee.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements AfterViewInit, OnInit {
  userName = ""
  tasks: any[] = []; // Initialize with some tasks
  updatedTask: Task[] = []; // Initialize with some tasks
  taskIds: string[] = [];
  taskIdIndex: any;
  tasksAssignedToEmployee: any;
  campaigns: Campaign[] = []; // Initialize with some campaigns
  projects: Project[] = []; // Initialize with some projects
  selectedProject: Project | null = null;
  @ViewChild("sidenav") sidenav!: MatSidenav;
  isExpanded = true;
  sideNavDisplayed = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;
  isAskTaskWiseOpen = false;
  displayedTasks: Task[] = [];
  employees: Employee[] = []
  selectedIndex = 0;
  workDaysToCompleteTask = 0;
  selectedProjectName: string | null = null;
  updatedStatus = ""
  loggedInUser: Employee | null = null; 
  avatarSrc = "https://cdn-icons-png.flaticon.com/256/147/147144.png";
  constructor(private dialog: MatDialog, private bottomSheet: MatBottomSheet,    private employeeService: EmployeeService, private taskService: TaskService,private campaignService: CampaignServiceService, private authService: AuthService, private userService: UserService) {
    // Fetch tasks and projects from a service or API
    // For now, let's just add some dummy data
    
  
    
  }
ngOnInit(): void {
     this.authService.getLoggedInUser().subscribe(user => {
      this.loggedInUser = user;
      if (this.loggedInUser) {
        this.authService.getEmployeeCalendar(this.loggedInUser.username).subscribe(response => {
          this.tasks = response.tasks;
        });
      }
    });

    this.authService.getUsers().subscribe((response: Employee[]) => {
      this.employees = response;
    });
  this.authService.getUsers().subscribe((response: Employee[]) => {
    this.employees = response;
  });
console.log(this.loggedInUser);

  this.authService.getUsers().subscribe((response: Employee[]) => {
    this.employees = response;
  });


this.userService.getUsers().subscribe
this.taskService.getProjects().subscribe((response) => {
  this.projects = response;
  console.log(this.projects);
  
});

this.taskService.getTasks().subscribe((response) => {
  this.tasks = response;
  console.log(this.tasks);  // Debug log to verify tasks
});

this.taskService.getAllTasksId().subscribe((response) => {
  this.taskIds = response;
  console.log(this.taskIds);  // Debug log to verify task IDs
});


this.campaignService.getCampaigns().subscribe((response) => {
  this.campaigns =response
})
}
  ngAfterViewInit() {
    // Set the selectedIndex to 0 to activate the first tab
    this.selectedIndex = 0;

    // Display tasks for the first project
    if (this.projects.length > 0) {
      this.displayProjectTasks(this.projects[0].name);
    }
  }

  viewProjectDetails(project: Project) {
    this.dialog.open(ProjectDetailsDialogComponent, {
      width: "400px",
      data: project,
    });
  }

  displaySideNav() {
    this.sideNavDisplayed = !this.sideNavDisplayed;
  }

  toggleSideNav(): void {
    this.sideNavDisplayed = !this.sideNavDisplayed;
    if (this.sideNavDisplayed) {
      this.openSideNav();
    } else {
      this.closeSideNav();
    }
  }

  openSideNav(): void {
    this.sidenav.open();
  }

  closeSideNav(): void {
    this.sidenav.close();
  }
  openCreateTaskDialog() {
    const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
      width: "400px"
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // If result is not null, add the new task to the list
        this.tasks.push(result);
      }
    });
  }

  displayProjectTasks(projectName: string) {
    console.log("displayProjectTasks called with project:", projectName);
    this.selectedProjectName = projectName;
  }

  getAssignedTasks(projectName: string): Task[] {
    return this.tasks.filter(
      (task) =>
        task.project === projectName && task.assignedTo && !task.completed
    );
  }

  getPendingTasks(projectName: string, index: number): Task[] {
    return this.tasks.filter(
      (task) =>
        task.project === projectName && !task.assignedTo && !task.completed
    );
  }
  getCompletedTasks(projectName: string, index: number): Task[] {
    return this.tasks.filter(
      (task) =>
        task.project === projectName && task.assignedTo && task.completed
    );
  }

  getActiveCampaigns(campaignActive: boolean): Campaign[] {
    return this.campaigns.filter(
      (campaign) => campaign.isActive === campaignActive
    );
  }
  completeTask(task: Task) {
    task.completed = true;
    task.status = Status.Complete;
  }


  openUpdatePhotoDialog(): void {
    const dialogRef = this.dialog.open(UpdatePhotoDialogComponent, {
      width: "300px",
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Update user's photo here
        // For demo purposes, let's assume the photo was uploaded successfully and update the avatar source
        this.avatarSrc = URL.createObjectURL(result);
      }
    });
  }
  openTaskDetailsDialog(task: Task, index: number) {
    
    const selectedTaskId = this.taskIds[index]; // Directly use the outer task's id property
    console.log(selectedTaskId);

    const dialogRef = this.dialog.open(TaskDetailsDialogComponent, {
      data: { task: task, selectedTaskId, employees: this.employees }, // Pass the inner task details and the outer task's id
      width: "80%",
      height: "80vh",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        task.title = result.title
        task.description = result.description
        task.dueDate = result.dueDate
        task.assignedTo = result.assignedTo
        task.priority = result.priority

        task.status = result.status
        
      }
    });
  }

  openCampaignDetailsDialog(campaign: Campaign) {
    this.dialog.open(CampaignDetailsDialogComponent, {
      data: campaign,
      width: "80%",
      height: "80vh",
    });
  }

  toggleAskTaskWise(): void {
    if (!this.isAskTaskWiseOpen) {
      // Open the bottom sheet
      const dialogRef = this.bottomSheet.open(AskTaskwiseDialogComponent, {
        data: {
          campaigns: this.campaigns,
          projects: this.projects,
          tasks: this.tasks,
        },
        panelClass: 'task-wise-bottom-sheet',
        hasBackdrop: false,
        closeOnNavigation: true
      });

      // Subscribe to the afterDismissed event
      dialogRef.afterDismissed().subscribe((result) => {
        // Check if a new task was added
      });
    } else {
      // Close the bottom sheet
      this.bottomSheet.dismiss();
    }

    // Toggle the state variable
    this.isAskTaskWiseOpen = !this.isAskTaskWiseOpen;
  }
  


  openTaskWiseAI() {
    const dialogRef = this.dialog.open(CreateTaskwiseTaskComponent, {
      data: {
        tasks: this.tasks,
        employees: this.employees,
        loggedInUser: this.loggedInUser,
      },
      width: "80%",
      height: "80vh",
    });

    dialogRef.afterClosed().subscribe((result) => {
      const newTask = result;
      if (newTask) {
        this.taskService.addTask(newTask).subscribe((response) => {
          this.workDaysToCompleteTask = newTask.duration ?? 0;
        });
        this.tasks.push(newTask);

        const assignedEmployee = this.employees.find(emp => emp.name === newTask.assignedTo);
        if (assignedEmployee) {
          assignedEmployee.tasks = assignedEmployee.tasks || [];
          assignedEmployee.tasks.push(newTask);

          // Call the postEmployeeCalendar method for the correct employee
          this.authService.postEmployeeCalendar(assignedEmployee.username, newTask).subscribe(
            (updatedEmployee) => {
              console.log('Employee calendar updated', updatedEmployee);
              // Optionally, update the local employee data with the updated employee data
              if (this.loggedInUser && this.loggedInUser.username === assignedEmployee.username) {
                this.authService.setLoggedInUser(updatedEmployee);
              }
            },
            (error) => {
              console.error('Error updating employee calendar', error);
            }
          );
        }
      }
    });
  }

  getTasksForEmployee(employee: Employee): Task[] {
    return this.tasks.filter(task => task.assignedTo === employee.name);
  }

 






  openCampaignWiseAI() {
    const dialogRef = this.dialog.open(CreateTaskwiseCampaignComponent, {
      data: {
        campaigns: this.campaigns,
        projects: this.projects,
        tasks: this.tasks,
      },
      width: "80%",
      height: "80vh",
    });

    dialogRef.afterClosed().subscribe((result) => {
      const newCampaign = dialogRef.componentInstance?.newCampaign;
      // Check if a new campaign was added
      if (newCampaign) {
        console.log(result, newCampaign);
        // Update the campaigns array or perform any other necessary actions
        this.campaigns.push(newCampaign);
      }
    });
  }
}
