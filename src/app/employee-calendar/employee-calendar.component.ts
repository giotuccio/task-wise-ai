import { Component, OnInit } from '@angular/core';
import { startOfISOWeek } from 'date-fns'; // Add this import statement

import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employee-calendar',
  templateUrl: './employee-calendar.component.html',
  styleUrls: ['./employee-calendar.component.css']
})
export class EmployeeCalendarComponent implements OnInit {
  selectedDate!: Date;
  startOfWeek!: Date;

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    const currentDate = new Date();
    // Calculate the start of the current week
    this.startOfWeek = startOfISOWeek(currentDate);
  }

  onDateSelected(date: Date) {
    this.selectedDate = date;
    // Fetch employee availability data for the selected date
    this.fetchEmployeeAvailability(date);
  }

  fetchEmployeeAvailability(date: Date) {
    // Call a service method to fetch employee availability data
    this.employeeService.getAvailability(date).subscribe(availabilities => {
      // Process and display the fetched data
    });
  }
}
