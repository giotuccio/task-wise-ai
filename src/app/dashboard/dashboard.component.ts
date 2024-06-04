import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Task } from '../objects/task.model'; // Assuming you have a Task model
import { Project } from '../objects/project.model';
import { MatDialog } from '@angular/material/dialog';
import { ProjectDetailsDialogComponent } from '../project-details-dialog/project-details-dialog.component';
import { CreateTaskDialogComponent } from '../create-task-dialog/create-task-dialog.component';
import { Priority } from '../objects/priority.model';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {
  tasks: Task[] = []; // Initialize with some tasks
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

  constructor(private dialog: MatDialog) {
    // Fetch tasks and projects from a service or API
    // For now, let's just add some dummy data
    this.tasks = [
      { project: 'Project A', title: 'Fix That', description: 'Description for Task 1', dueDate: '2024-06-10', priority: Priority.High, completed: false, assignedTo: 'Gio' },
      { project: 'Project A', title: 'Task 2', description: 'Description for Task 2', dueDate: '2024-06-15', priority: Priority.Low, completed: false, assignedTo: 'John' },
      { project: 'Project A', title: 'Task 3', description: 'Description for Task 2', dueDate: '2024-06-15', priority: Priority.Low, completed: false, assignedTo: 'John' },
      { project: 'Project B', title: 'Task 4', description: 'Description for Task 2', dueDate: '2024-06-15', priority: Priority.Low, completed: false, assignedTo: 'John' },
      { project: 'Project A', title: 'Task 5', description: 'Description for Task 2', dueDate: '2023-06-15', priority: Priority.Low, completed: false },
      { project: 'Project A', title: 'Task 6', description: 'Description for Task 2', dueDate: '2024-06-15', priority: Priority.Low, completed: false, assignedTo: 'John' },
      { project: 'Project A', title: 'Task 7', description: 'Description for Task 2', dueDate: '2024-06-15', priority: Priority.Low, completed: false },
      { project: 'Project A', title: 'Task 8', description: 'Description for Task 2', dueDate: '2025-06-15', priority: Priority.Medium, completed: false, assignedTo: 'John' },
      { project: 'Project B', title: 'Task 9', description: 'Description for Task 2', dueDate: '2024-06-15', priority: Priority.Low, completed: false, assignedTo: 'John' },
      { project: 'Project A', title: 'Task 10', description: 'Description for Task 2', dueDate: '2024-06-15', priority: Priority.Low, completed: false, assignedTo: 'John' },
      { project: 'Project B', title: 'Task 11', description: 'Description for Task 3', dueDate: '2024-06-20', priority: Priority.Medium, completed: false }
    ];

    this.projects = [
      { name: 'Project A', description: 'Description for Project A', startDate: '2024-06-01', endDate: '2024-07-15' },
      { name: 'Project B', description: 'Description for Project B', startDate: '2024-07-01', endDate: '2024-08-15' }
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
  completeTask(task: Task) {
    task.completed = true;
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
}
