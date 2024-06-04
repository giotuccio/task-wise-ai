import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskMessageUpdatesComponent } from './task-message-updates.component';

describe('TaskMessageUpdatesComponent', () => {
  let component: TaskMessageUpdatesComponent;
  let fixture: ComponentFixture<TaskMessageUpdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskMessageUpdatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskMessageUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
