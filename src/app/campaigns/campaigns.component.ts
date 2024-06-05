import { Component, Input } from '@angular/core';
import { Campaign } from '../objects/campaign.model';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent {
  @Input() campaign!: Campaign;

}
