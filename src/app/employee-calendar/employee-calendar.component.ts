import { Component, OnInit, Input } from '@angular/core';
import { Task } from '../objects/task.model';
import { Employee } from '../objects/employee.model';

@Component({
  selector: 'app-employee-calendar',
  templateUrl: './employee-calendar.component.html',
  styleUrls: ['./employee-calendar.component.css']
})
export class EmployeeCalendarComponent implements OnInit {
  @Input() tasks: Task[] = [];
  @Input() employee!: Employee;

  daysOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weeksInMonth: any[] = [];
  currentMonth: Date = new Date();

  ngOnInit(): void {
    this.generateCalendar(this.currentMonth);
  }

  generateCalendar(date: Date): void {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const startDate = this.getStartDate(startOfMonth);
    const endDate = this.getEndDate(endOfMonth);

    const weeks: any[] = [];
    let currentWeek: any[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      currentWeek.push({ date: currentDate.getDate(), fullDate: new Date(currentDate) });
      if (currentDate.getDay() === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    this.weeksInMonth = weeks;
  }

  getStartDate(startOfMonth: Date): Date {
    const dayOfWeek = startOfMonth.getDay();
    const startDate = new Date(startOfMonth);
    startDate.setDate(startOfMonth.getDate() - dayOfWeek);
    return startDate;
  }

  getEndDate(endOfMonth: Date): Date {
    const dayOfWeek = endOfMonth.getDay();
    const endDate = new Date(endOfMonth);
    endDate.setDate(endOfMonth.getDate() + (6 - dayOfWeek));
    return endDate;
  }

  getTasksForDay(date: Date): Task[] {
    return this.tasks?.filter(task => {
      const taskDate = new Date(task.dueDate);
      return task.assignedTo === this.employee.name &&
             taskDate.getFullYear() === date.getFullYear() &&
             taskDate.getMonth() === date.getMonth() &&
             taskDate.getDate() === date.getDate();
    }) || [];
  }

  previousMonth(): void {
    const newDate = new Date(this.currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    this.currentMonth = newDate;
    this.generateCalendar(this.currentMonth);
  }

  nextMonth(): void {
    const newDate = new Date(this.currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    this.currentMonth = newDate;
    this.generateCalendar(this.currentMonth);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }
}
