import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Campaign } from '../objects/campaign.model';

@Component({
  selector: 'app-campaign-details-dialog',
  templateUrl: './campaign-details-dialog.component.html',
  styleUrls: ['./campaign-details-dialog.component.css']
})
export class CampaignDetailsDialogComponent {
  campaigns: any; // Define your campaign object

  chartData = [
    { label: 'Total Campaigns Sent', value: 300, color: 'blue' },
    { label: 'Postive Feedback', value: 75, color: 'green' },
    { label: 'Negative Feedback', value: 60, color: 'red' },
    { label: 'No Feedback', value: 60, color: 'indigo' },
    // Add more data with colors as needed
  ];
  constructor(@Inject(MAT_DIALOG_DATA) public campaign: Campaign) { }




  onSelect(event: any) {
    console.log(event);
  }
}
