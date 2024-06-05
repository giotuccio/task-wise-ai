import { Injectable } from '@angular/core';
import { Campaign } from '../objects/campaign.model';

@Injectable({
  providedIn: 'root'
})
export class CampaignServiceService {
  private campaigns: Campaign[] = [];

  constructor() {}

  getCampaigns(): Campaign[] {
    return this.campaigns;
  }

  addCampaign(campaign: Campaign): void {
    this.campaigns.push(campaign);
  }
  createCampaign( name: string, description: string, startDate: string,endDate: string, isActive: boolean ): Campaign { const newCampaign: Campaign = {name, description, startDate,endDate, isActive }; return newCampaign; } 
  // Additional methods for task management (e.g., update, delete) can be added here
}
