import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignDetailsDialogComponent } from './campaign-details-dialog.component';

describe('CampaignDetailsDialogComponent', () => {
  let component: CampaignDetailsDialogComponent;
  let fixture: ComponentFixture<CampaignDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignDetailsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
