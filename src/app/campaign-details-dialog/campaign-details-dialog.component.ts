import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Campaign } from '../objects/campaign.model';
import { TaskwiseAIService } from '../services/task-wise-ai.service';

@Component({
  selector: 'app-campaign-details-dialog',
  templateUrl: './campaign-details-dialog.component.html',
  styleUrls: ['./campaign-details-dialog.component.css']
})
export class CampaignDetailsDialogComponent {
  campaigns: any; // Define your campaign object
  isWaiting = false
imageUrl = ""
  chartData = [
    { label: 'Total Campaigns Sent', value: 300, color: 'blue' },
    { label: 'Postive Feedback', value: 75, color: 'green' },
    { label: 'Negative Feedback', value: 60, color: 'red' },
    { label: 'No Feedback', value: 60, color: 'indigo' },
    // Add more data with colors as needed
  ];
  constructor(@Inject(MAT_DIALOG_DATA) public campaign: Campaign, private taskwiseAIService: TaskwiseAIService) { }

generateImage(){
  this.isWaiting = true;
  this.taskwiseAIService.generateImage(`Generate an image based off the description of this campaign.  Make it look like an advertisement   ${this.campaign.description}.`).subscribe((response) => {
    if(response){
this.imageUrl = response.data[0].url
this.isWaiting = false;
}
  })

}


  onSelect(event: any) {
    console.log(event);
  }
}
