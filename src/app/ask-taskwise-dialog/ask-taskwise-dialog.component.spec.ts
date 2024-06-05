import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskTaskwiseDialogComponent } from './ask-taskwise-dialog.component';

describe('AskTaskwiseDialogComponent', () => {
  let component: AskTaskwiseDialogComponent;
  let fixture: ComponentFixture<AskTaskwiseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskTaskwiseDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AskTaskwiseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
