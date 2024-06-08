import { Injectable } from '@angular/core';
import { Campaign } from '../objects/campaign.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CampaignServiceService {
  private campaigns: Campaign[] = [];

  constructor(private http: HttpClient) {}

  getCampaigns(): Campaign[] {
    return this.campaigns;
  }

  addCampaign(campaign: Campaign): Observable<any> {
    return this.http.post<any>('https://jsonplaceholder.typicode.com/posts/1', { campaign: campaign, title: campaign.name});

  }
  createCampaign( name: string, description: string, startDate: string,endDate: string, isActive: boolean ): Campaign { const newCampaign: Campaign = {name, description, startDate,endDate, isActive }; return newCampaign; } 
  // Additional methods for task management (e.g., update, delete) can be added here
}
