import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskwiseTaskDetailsAssistComponent } from './taskwise-task-details-assist.component';

describe('TaskwiseTaskDetailsAssistComponent', () => {
  let component: TaskwiseTaskDetailsAssistComponent;
  let fixture: ComponentFixture<TaskwiseTaskDetailsAssistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskwiseTaskDetailsAssistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskwiseTaskDetailsAssistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
