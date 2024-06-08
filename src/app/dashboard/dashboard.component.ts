import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { Task } from "../objects/task.model"; // Assuming you have a Task model
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

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements AfterViewInit, OnInit {
  userName = ""
  tasks: Task[] = []; // Initialize with some tasks
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
  employees = []
  selectedIndex = 0;
  selectedProjectName: string | null = null;
  avatarSrc = "https://cdn-icons-png.flaticon.com/256/147/147144.png";
  constructor(private dialog: MatDialog, private bottomSheet: MatBottomSheet, private taskService: TaskService,private campaignService: CampaignServiceService, private authService: AuthService, private userService: UserService) {
    // Fetch tasks and projects from a service or API
    // For now, let's just add some dummy data
    this.userName = authService.getLoggedInUserName()  ?? "Gio"
  
    
  }
ngOnInit(): void {
  
this.userService.getUsers().subscribe((response) => {
  if(response){
    this.employees = response; 
    console.log(this.employees);
    
  }


})
this.taskService.getTasks().subscribe((response) => {
  this.tasks = response
})
this.taskService.getProjects().subscribe((response) => {
  this.projects = response
})
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

  getPendingTasks(projectName: string): Task[] {
    return this.tasks.filter(
      (task) =>
        task.project === projectName && !task.assignedTo && !task.completed
    );
  }
  getCompletedTasks(projectName: string): Task[] {
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
  sortByDate() {
    this.tasks.sort((a, b) => {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }

  sortByAssigned() {
    this.tasks.sort((a, b) => {
      if (!a.assignedTo && !b.assignedTo) {
        return 0;
      } else if (!a.assignedTo) {
        return -1;
      } else if (!b.assignedTo) {
        return 1;
      } else {
        return 0;
      }
    })
  }

  sortByPriority() {
    this.tasks.sort((a, b) => {
      const priorityOrder = {
        [Priority.Low]: 0,
        [Priority.Medium]: 1,
        [Priority.High]: 2,
      };

      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
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

  openTaskDetailsDialog(task: Task) {
    const dialogRef = this.dialog.open(TaskDetailsDialogComponent, {
      data: task,
      width: "80%",
      height: "80vh",
    });
    dialogRef.afterClosed().subscribe((result) => {
      // If result is not null, add the new task to the list
      // this.tasks.push(dialogRef.componentInstance.task);
    
      console.log(dialogRef.componentInstance.task);
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
        campaigns: this.campaigns,
        projects: this.projects,
        tasks: this.tasks,
        employees: this.employees
      },
      width: "80%",
      height: "80vh",
    });

    dialogRef.afterClosed().subscribe((result) => {
      const newTask = dialogRef.componentInstance?.newTask;
      // Check if a new task was added
      if (newTask) {
        console.log(result, newTask);
      this.taskService.addTask(newTask).subscribe((response) => {
        console.log(response);
        
      });
        // Update the tasks array or perform any other necessary actions
        this.tasks.push(newTask);
      }
    });
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
