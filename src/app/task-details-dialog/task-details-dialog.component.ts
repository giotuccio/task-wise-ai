import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task, Tasks } from '../objects/task.model';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-details-dialog',
  templateUrl: './task-details-dialog.component.html',
  styleUrls: ['./task-details-dialog.component.css']
})
export class TaskDetailsDialogComponent {
  newTask!: Task
  editedTask!: Tasks
  taskId: string = "";
  isDeleted = false;
  constructor(@Inject(MAT_DIALOG_DATA) public task: Task,
  private taskService: TaskService, private dialogRef: MatDialogRef<TaskDetailsDialogComponent>) { 
    task = this.newTask;
  
  }



  editTask(task: Tasks) {
    
this.taskService.editTask(task.id).subscribe((response) => {
console.log(response);

})

  this.dialogRef.close();

  }
  
  deleteTask(task: Task) {
    // Implement delete task logic here
    // For example, you can ask for confirmation before deletion
    this.taskService.deleteTask(task).subscribe((response) => {
      console.log(response);
   this.dialogRef.close();
      
    })


  }
  
  updateTaskStatus(newStatus: Task) {
    // Implement update task status logic here
  }
}
