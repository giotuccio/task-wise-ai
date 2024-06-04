import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskTalkwiseComponent } from './ask-talkwise.component';

describe('AskTalkwiseComponent', () => {
  let component: AskTalkwiseComponent;
  let fixture: ComponentFixture<AskTalkwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskTalkwiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AskTalkwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
