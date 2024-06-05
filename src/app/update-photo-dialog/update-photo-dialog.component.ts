import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-photo-dialog',
  templateUrl: './update-photo-dialog.component.html',
  styleUrls: ['./update-photo-dialog.component.css']
})
export class UpdatePhotoDialogComponent {
  selectedFile: File | undefined;

  constructor(
    public dialogRef: MatDialogRef<UpdatePhotoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onUploadClick(): void {
    // Implement upload functionality here
    // Once the photo is uploaded, you can close the dialog and update the user's photo
    this.dialogRef.close(this.selectedFile);
  }
}
