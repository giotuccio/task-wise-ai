import { Component } from '@angular/core';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employee-calendar',
  templateUrl: './employee-calendar.component.html',
  styleUrls: ['./employee-calendar.component.css']
})
export class EmployeeCalendarComponent {
  selectedDate!: Date;

  constructor(private employeeService: EmployeeService) { }

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
