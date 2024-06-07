import { AfterViewInit, Component, ViewChild } from "@angular/core";
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

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements AfterViewInit {
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
  displayedTasks: Task[] = [];
  selectedIndex = 0;
  selectedProjectName: string | null = null;
  avatarSrc = "https://cdn-icons-png.flaticon.com/256/147/147144.png";
  constructor(private dialog: MatDialog, private bottomSheet: MatBottomSheet, private taskService: TaskService) {
    // Fetch tasks and projects from a service or API
    // For now, let's just add some dummy data
    this.tasks = [
      {
        id: "1",
        project: "Online Account Opening",
        title: "Update User Profile Page",
        description: "The user profile page needs to be updated to include new fields for the user's address, phone number, and profile picture. Additionally, the layout should be optimized for mobile devices to ensure a better user experience. The changes should be consistent with the overall design of the application and should be implemented following the existing coding standards.",
        dueDate: "2024-06-15",
        priority: Priority.Low,
        status: Status.In_Progress,
        completed: false,
        assignedTo: "John",
        assignedBy: "Lucy Lu",
      },
      {
        id: "2",
        project: "Digital Marketing",
        title: "Create Social Media Campaign",
        description: "Develop a comprehensive social media strategy including content planning, audience targeting, and performance tracking across various platforms such as Facebook, Instagram, and Twitter.",
        dueDate: "2024-06-20",
        priority: Priority.Medium,
        status: Status.New,
        completed: false,
      },
      {
        id: "3",
        project: "Online Account Opening",
        title: "Update Billing Information",
        description: "Revise the billing information section to allow users to add multiple payment methods, view past transactions, and manage billing preferences with ease.",
        dueDate: "2024-06-15",
        priority: Priority.Low,
        status: Status.In_Progress,
        completed: false,
        assignedTo: "John",
        assignedBy: "Lucy Lu",
      },
      {
        id: "4",
        project: "Digital Marketing",
        title: "Launch Email Campaign",
        description: "Execute a targeted email marketing campaign to engage existing customers, promote new products, and drive website traffic. The campaign should be optimized for different devices and email clients.",
        dueDate: "2024-06-20",
        priority: Priority.Medium,
        status: Status.New,
        completed: false,
      },
      {
        id: "5",
        project: "Online Account Opening",
        title: "Add Two-Factor Authentication",
        description: "Implement two-factor authentication for enhanced security, requiring users to verify their identity using a second method such as a code sent to their mobile device or email.",
        dueDate: "2024-06-15",
        priority: Priority.Low,
        status: Status.In_Progress,
        completed: false,
        assignedTo: "John",
        assignedBy: "Lucy Lu",
      },
      {
        id: "6",
        project: "Digital Marketing",
        title: "Create PPC Campaign",
        description: "Set up a pay-per-click advertising campaign on search engines and social media platforms to increase brand visibility, generate leads, and drive conversions. The campaign should target relevant keywords and demographics.",
        dueDate: "2024-06-20",
        priority: Priority.Medium,
        status: Status.New,
        completed: false,
      },
      {
        id: "7",
        project: "Online Account Opening",
        title: "Enhance User Dashboard",
        description: "Enhance the user dashboard with interactive data visualizations, personalized widgets, and customizable layouts. The goal is to provide users with a seamless and intuitive experience when accessing their account information.",
        dueDate: "2024-06-15",
        priority: Priority.Low,
        status: Status.In_Progress,
        completed: false,
        assignedTo: "John",
        assignedBy: "Lucy Lu",
      },
      {
        id: "8",
        project: "Digital Marketing",
        title: "Optimize Landing Pages",
        description: "Optimize landing pages for improved conversion rates by implementing A/B testing, analyzing user behavior, and refining page elements such as headlines, call-to-action buttons, and form fields.",
        dueDate: "2024-06-20",
        priority: Priority.Medium,
        status: Status.New,
        completed: false,
      },
      {
        id: "9",
        project: "Online Account Opening",
        title: "Implement Live Chat Support",
        description: "Integrate live chat functionality into the website to provide real-time assistance to users, answer queries, and address concerns promptly. The chat system should be accessible from any page and compatible with desktop and mobile devices.",
        dueDate: "2024-06-15",
        priority: Priority.Low,
        status: Status.In_Progress,
        completed: false,
        assignedTo: "John",
        assignedBy: "Lucy Lu",
      },
      {
        id: "10",
        project: "Digital Marketing",
        title: "Create Content Calendar",
        description: "Develop a content calendar outlining topics, publication dates, and distribution channels for blog posts, social media updates, and email newsletters. The calendar should align with marketing objectives and target audience interests.",
        dueDate: "2024-06-20",
        priority: Priority.Medium,
        status: Status.New,
        completed: false,
        assignedTo: "John",
        assignedBy: "TaskWiseAI"
      }
    ];
    
    this.campaigns = [
      {
        name: "Campaign 1",
        description: "Description for Online Account Opening",
        startDate: "2024-06-01",
        endDate: "2024-07-15",
        isActive: true,
      },
      {
        name: "Campaign 2",
        description: "Description for Online Account Opening",
        startDate: "2024-06-01",
        endDate: "2024-07-15",
        isActive: false,
      },
      {
        name: "Campaign 3",
        description: "Description for Online Account Opening",
        startDate: "2024-06-01",
        endDate: "2024-07-15",
        isActive: true,
      },
      {
        name: "Campaign 4",
        description: "Campaign for sneaker products that are half off for a limited time. these sneakers can make you jump higher",
        startDate: "2024-06-01",
        endDate: "2024-07-15",
        isActive: false,
      },
      {
        name: "Campaign 5",
        description: "Description for Online Account Opening",
        startDate: "2024-06-01",
        endDate: "2024-07-15",
        isActive: true,
      },
    ];

    this.projects = [
      {
        name: "Online Account Opening",
        description: "Description for Online Account Opening",
        startDate: "2024-06-01",
        endDate: "2024-07-15",
      },
      {
        name: "Digital Marketing",
        description: "Description for Digital Marketing",
        startDate: "2024-07-01",
        endDate: "2024-08-15",
      },
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
    });
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
  openAskTaskWise() {
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

    dialogRef.afterDismissed().subscribe((result) => {
      // Check if a new task was added
 
    });
  }
  openTaskWiseAI() {
    const dialogRef = this.dialog.open(CreateTaskwiseTaskComponent, {
      data: {
        campaigns: this.campaigns,
        projects: this.projects,
        tasks: this.tasks,
      },
      width: "80%",
      height: "80vh",
    });

    dialogRef.afterClosed().subscribe((result) => {
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
