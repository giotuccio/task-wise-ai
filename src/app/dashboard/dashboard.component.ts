import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Task } from '../objects/task.model'; // Assuming you have a Task model
import { Project } from '../objects/project.model';
import { MatDialog } from '@angular/material/dialog';
import { ProjectDetailsDialogComponent } from '../project-details-dialog/project-details-dialog.component';
import { CreateTaskDialogComponent } from '../create-task-dialog/create-task-dialog.component';
import { Priority } from '../objects/priority.model';
import { MatSidenav } from '@angular/material/sidenav';
import { TaskDetailsDialogComponent } from '../task-details-dialog/task-details-dialog.component';
import { Status } from '../objects/status.model';
import { Campaign } from '../objects/campaign.model';
import { CampaignDetailsDialogComponent } from '../campaign-details-dialog/campaign-details-dialog.component';
import { CreateTaskwiseTaskComponent } from '../create-taskwise-task/create-taskwise-task.component';
import { CreateTaskwiseCampaignComponent } from '../create-taskwise-campaign/create-taskwise-campaign.component';
import { AskTaskwiseDialogComponent } from '../ask-taskwise-dialog/ask-taskwise-dialog.component';
import { UpdatePhotoDialogComponent } from '../update-photo-dialog/update-photo-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {
  tasks: Task[] = []; // Initialize with some tasks
  campaigns: Campaign[] = []; // Initialize with some campaigns
  projects: Project[] = []; // Initialize with some projects
  selectedProject: Project | null = null;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isExpanded = true;
  sideNavDisplayed = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;
  displayedTasks: Task[] = [];
  selectedIndex = 0;
  selectedProjectName: string | null = null;
  avatarSrc = 'https://cdn-icons-png.flaticon.com/256/147/147144.png';
  constructor(private dialog: MatDialog) {
    // Fetch tasks and projects from a service or API
    // For now, let's just add some dummy data
    this.tasks = [
      {id: '1', project: 'Online Account Opening', title: 'Fix That', description: 'Description for Task 1', dueDate: '2024-06-10', priority: Priority.High, status: Status.In_Progress, completed: false, assignedTo: 'Gio', assignedBy: 'Lucy Lu' },
      {id: '1', project: 'Online Account Opening', title: 'Task 2', description: 'Description for Task 2', dueDate: '2024-06-15', priority: Priority.Low, status: Status.In_Progress, completed: false, assignedTo: 'John', assignedBy: 'Lucy Lu' },
      {id: '1', project: 'Online Account Opening', title: 'Task 3', description: 'Description for Task 2', dueDate: '2024-06-15', priority: Priority.Low, status: Status.In_Progress, completed: false, assignedTo: 'John', assignedBy: 'Mary Jane' },
      { id: '1',project: 'Digital Marketing', title: 'Task 4', description: 'Description for Task 2', dueDate: '2024-06-15', priority: Priority.Low, status: Status.In_Progress, completed: false, assignedTo: 'John', assignedBy: 'Lucy Lu' },
      {id: '1', project: 'Online Account Opening', title: 'Task 5', description: 'Description for Task 2', dueDate: '2023-06-15', priority: Priority.Low, status: Status.In_Progress, completed: false, assignedBy: 'Mary Jane' },
      {id: '1', project: 'Online Account Opening', title: 'Task 6', description: 'Description for Task 2', dueDate: '2024-06-15', priority: Priority.Low, status: Status.In_Progress, completed: false, assignedTo: 'John', assignedBy: 'Lucy Lu' },
      {id: '1', project: 'Online Account Opening', title: 'Task 7', description: 'Description for Task 2', dueDate: '2024-06-15', priority: Priority.Low, status: Status.In_Progress, completed: false, assignedBy: 'Lucy Lu' },
      {id: '1', project: 'Online Account Opening', title: 'Task 8', description: 'Description for Task 2', dueDate: '2025-06-15', priority: Priority.Medium, status: Status.In_Progress, completed: false, assignedTo: 'John', assignedBy: 'Mary Jane' },
      { id: '1',project: 'Digital Marketing', title: 'Task 9', description: 'Description for Task 2', dueDate: '2024-06-15', priority: Priority.Low, completed: false, status: Status.In_Progress, assignedTo: 'John', assignedBy: 'Lucy Lu' },
      { id: '1',project: 'Online Account Opening', title: 'Task 10', description: 'Description for Task 2', dueDate: '2024-06-15', priority: Priority.Low, status: Status.In_Progress, completed: false, assignedTo: 'John', assignedBy: 'Lucy Lu' },
      { id: '2',project: 'Digital Marketing', title: 'Task 11', description: 'Description for Task 3', dueDate: '2024-06-20', duration: 1000, priority: Priority.Medium, status: Status.New, completed: false }
    ];
    this.campaigns = [

      { name: 'Campaign 1', description: 'Description for Online Account Opening', startDate: '2024-06-01', endDate: '2024-07-15', isActive: true },
      { name: 'Campaign 2', description: 'Description for Online Account Opening', startDate: '2024-06-01', endDate: '2024-07-15', isActive: false },
      { name: 'Campaign 3', description: 'Description for Online Account Opening', startDate: '2024-06-01', endDate: '2024-07-15', isActive: true },
      { name: 'Campaign 4', description: 'Description for Online Account Opening', startDate: '2024-06-01', endDate: '2024-07-15', isActive: false },
      { name: 'Campaign 5', description: 'Description for Online Account Opening', startDate: '2024-06-01', endDate: '2024-07-15', isActive: true },

    ];

    this.projects = [
      { name: 'Online Account Opening', description: 'Description for Online Account Opening', startDate: '2024-06-01', endDate: '2024-07-15' },
      { name: 'Digital Marketing', description: 'Description for Digital Marketing', startDate: '2024-07-01', endDate: '2024-08-15' }
    ];
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
      width: '400px',
      data: project
    });
  }

  displaySideNav() {
    this.sideNavDisplayed = !this.sideNavDisplayed;
  }

  openCreateTaskDialog() {
    const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // If result is not null, add the new task to the list
        this.tasks.push(result);
      }
    });
  }

  displayProjectTasks(projectName: string) {
    console.log('displayProjectTasks called with project:', projectName);
    this.selectedProjectName = projectName;
  }

  getAssignedTasks(projectName: string): Task[] {
    return this.tasks.filter(task => task.project === projectName && task.assignedTo && !task.completed);
  }

  getPendingTasks(projectName: string): Task[] {
    return this.tasks.filter(task => task.project === projectName && !task.assignedTo && !task.completed);
  }
  getCompletedTasks(projectName: string): Task[] {
    return this.tasks.filter(task => task.project === projectName && task.assignedTo && task.completed);
  }

  getActiveCampaigns(campaignActive: boolean): Campaign[] {
    return this.campaigns.filter(campaign => campaign.isActive === campaignActive)
  }
  completeTask(task: Task) {
    task.completed = true;
    task.status = Status.Complete
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
    });
  }

  sortByPriority() {
    this.tasks.sort((a, b) => {
      const priorityOrder = {
        [Priority.Low]: 0,
        [Priority.Medium]: 1,
        [Priority.High]: 2
      };

      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  openUpdatePhotoDialog(): void {
    const dialogRef = this.dialog.open(UpdatePhotoDialogComponent, {
      width: '300px',
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
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
      width: '80%',
      height: '80vh'
    });
    dialogRef.afterClosed().subscribe(result => {
      // If result is not null, add the new task to the list
      // this.tasks.push(dialogRef.componentInstance.task);
      console.log(dialogRef.componentInstance.task);

    });
  }
  
  openCampaignDetailsDialog(campaign: Campaign) {
    this.dialog.open(CampaignDetailsDialogComponent, {
      data: campaign,
      width: '80%',
      height: '80vh'
    });
  }
  openAskTaskWise() {
    const dialogRef = this.dialog.open(AskTaskwiseDialogComponent, {
      data: {
        campaigns: this.campaigns,
        projects: this.projects,
        tasks: this.tasks
      },
      width: '80%',
      height: '80vh'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      const newTask = dialogRef.componentInstance?.newTask;
      // Check if a new task was added
      if (newTask) {
        console.log(result, newTask);
        // Update the tasks array or perform any other necessary actions
        this.tasks.push(newTask);
      }
    });
  }
  openTaskWiseAI() {
    const dialogRef = this.dialog.open(CreateTaskwiseTaskComponent, {
      data: {
        campaigns: this.campaigns,
        projects: this.projects,
        tasks: this.tasks
      },
      width: '80%',
      height: '80vh'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      const newTask = dialogRef.componentInstance?.newTask;
      // Check if a new task was added
      if (newTask) {
        console.log(result, newTask);
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
        tasks: this.tasks
      },
      width: '80%',
      height: '80vh'
    });
  
    dialogRef.afterClosed().subscribe(result => {
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
