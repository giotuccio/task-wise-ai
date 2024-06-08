import { Injectable } from '@angular/core';
import { Campaign } from '../objects/campaign.model';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CampaignServiceService {
  private campaigns: Campaign[] = [];
  private jsonServerUrl = 'http://localhost:3000/campaigns';

  constructor(private http: HttpClient) {}


  getCampaigns(): Observable<Campaign[]> {
    return this.http.get<{ campaign: Campaign }[]>(this.jsonServerUrl).pipe(
      map(response => response.map(data => data.campaign))
    );
  }
  addCampaign(campaign: Campaign): Observable<any> {
    return this.http.post<any>(this.jsonServerUrl, { campaign: campaign});

  }
  createCampaign( name: string, description: string, startDate: string,endDate: string, isActive: boolean ): Campaign { const newCampaign: Campaign = {name, description, startDate,endDate, isActive }; return newCampaign; } 
  // Additional methods for task management (e.g., update, delete) can be added here
}
