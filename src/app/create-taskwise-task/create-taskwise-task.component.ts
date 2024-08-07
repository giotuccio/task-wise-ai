import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { TaskwiseAIService } from '../services/task-wise-ai.service';
import { TaskService } from '../services/task.service';
import { Priority } from '../objects/priority.model';
import { Status } from '../objects/status.model';
import { Task } from '../objects/task.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateTaskDialogComponent } from '../create-task-dialog/create-task-dialog.component';

@Component({
  selector: 'app-create-taskwise-task',
  templateUrl: './create-taskwise-task.component.html',
  styleUrls: ['./create-taskwise-task.component.css']
})
export class CreateTaskwiseTaskComponent {
  responseFromAI: string = "";
  prompt: string = ""
  newTask!: Task;
  isWaiting = false;
  employees: any
  loggedInUser: string
  constructor(private taskwiseAIService: TaskwiseAIService,  private taskService: TaskService,
    @Inject(MAT_DIALOG_DATA) public task: Task,
    @Inject(MAT_DIALOG_DATA) public data: { employees: Array<object>, loggedInEmployeesName: string },
    private dialogRef: MatDialogRef<CreateTaskwiseTaskComponent>,
    private dialog: MatDialog) { 
      this.employees = data.employees ?? []
      this.loggedInUser = data.loggedInEmployeesName;

      console.log(this.loggedInUser, this.employees.map((x: { name: any; }) => x.name));
      
    }

    sendMessageToAI(prompt: string): void {
      this.loggedInUser = this.data.loggedInEmployeesName
      this.isWaiting = true;
      this.prompt = prompt;
      this.taskwiseAIService.sendTaskMessage(prompt + ` 
        the loggedin user is ${this.loggedInUser}.

        You can populate property assignTo with the value of an employees name.  
        
        List of employees: ${this.employees.map((x: { name: any; }) => x.name).join(', ')},`).subscribe(response => {
        if (response)
          this.isWaiting = false;
        this.responseFromAI = response.choices[0].message.content; // Extracting the task details from the response
  
        // Logging the response content
        console.log('Response from AI:', this.responseFromAI);
  
        // Preprocessing the response to remove square brackets from the description
        const preprocessedResponse = this.responseFromAI.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
        // Parsing the task details from the preprocessed response
        try {
          const taskDetails = JSON.parse(preprocessedResponse);
  
          this.newTask = {
            id: taskDetails.id,
            project: taskDetails.project,
            title: taskDetails.title,
            description: taskDetails.description,
            dueDate: taskDetails.dueDate,
            priority: taskDetails.priority as Priority,
            status: taskDetails.status as Status,
            assignedTo: taskDetails.assignedTo,
            assignedBy: taskDetails.assignedBy,
            duration: taskDetails.duration,
            completed: taskDetails.completed,
            isDeleted: false
          };
  
  
          // Close the dialog and pass the new task back to the parent component
  
        } catch (error) {
          console.error('Error parsing response:', error);
        }
      });
    }
  



  regenerateResponse(): void {
    // Clear the current response and send a new prompt to the AI
    this.responseFromAI = "";
    
    // Provide more specific details about the task in the prompt
    const prompt = '{"message": "create a new task with the following details changed: title, description, due date, priority, assigned to, assigned by, and project."}';
    
    this.sendMessageToAI('configure that task with the following details enhance: title, description' + this.prompt);
  }
  
  updateEmployeeCalendar(task: Task) {
    const assignedEmployee = this.employees.find((emp: { name: string }) => emp.name === task.assignedTo);
    if (assignedEmployee) {
      assignedEmployee.tasks = assignedEmployee.tasks || [];
      assignedEmployee.tasks.push(task);
    }
  }
  closeDialog(): void {
    
          // Adding the new task
  
          // Optionally, you can also update the employee's calendar here
    // Close the dialog and pass the updated task back to the parent component
    this.dialogRef.close(this.newTask);
  }
}
