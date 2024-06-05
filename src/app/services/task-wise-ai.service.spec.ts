import { TestBed } from '@angular/core/testing';

import { TaskWiseAiService } from './task-wise-ai.service';

describe('TaskWiseAiService', () => {
  let service: TaskWiseAiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskWiseAiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
