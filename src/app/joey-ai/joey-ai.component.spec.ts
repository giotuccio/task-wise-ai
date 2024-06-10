import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoeyAiComponent } from './joey-ai.component';

describe('JoeyAiComponent', () => {
  let component: JoeyAiComponent;
  let fixture: ComponentFixture<JoeyAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoeyAiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoeyAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
