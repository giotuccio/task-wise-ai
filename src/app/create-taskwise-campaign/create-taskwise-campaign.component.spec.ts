import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTaskwiseCampaignComponent } from './create-taskwise-campaign.component';

describe('CreateTaskwiseCampaignComponent', () => {
  let component: CreateTaskwiseCampaignComponent;
  let fixture: ComponentFixture<CreateTaskwiseCampaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTaskwiseCampaignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTaskwiseCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
