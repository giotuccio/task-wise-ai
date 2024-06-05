import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Campaign } from '../objects/campaign.model';

@Component({
  selector: 'app-campaign-details-dialog',
  templateUrl: './campaign-details-dialog.component.html',
  styleUrls: ['./campaign-details-dialog.component.css']
})
export class CampaignDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public campaign: Campaign) { }
}
