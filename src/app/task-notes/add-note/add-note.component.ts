import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.css']
})
export class AddNoteDialogComponent {
  noteContent: string = '';

  constructor(public dialogRef: MatDialogRef<AddNoteDialogComponent>) { }

  saveNote() {
    this.dialogRef.close(this.noteContent);
  }

  cancel() {
    this.dialogRef.close();
  }
}
