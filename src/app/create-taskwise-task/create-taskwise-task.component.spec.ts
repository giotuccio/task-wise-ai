import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTaskwiseTaskComponent } from './create-taskwise-task.component';

describe('CreateTaskwiseTaskComponent', () => {
  let component: CreateTaskwiseTaskComponent;
  let fixture: ComponentFixture<CreateTaskwiseTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTaskwiseTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTaskwiseTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
