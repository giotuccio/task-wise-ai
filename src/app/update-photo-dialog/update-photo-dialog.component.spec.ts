import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePhotoDialogComponent } from './update-photo-dialog.component';

describe('UpdatePhotoDialogComponent', () => {
  let component: UpdatePhotoDialogComponent;
  let fixture: ComponentFixture<UpdatePhotoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePhotoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePhotoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
