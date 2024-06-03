import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  getAvailability(date: Date): Observable<any> {
    // Make an HTTP request to fetch employee availability data for the specified date
    // Adjust the URL and request parameters according to your API endpoint
    return this.http.get<any>(`/api/availability/${date}`);
  }
}
