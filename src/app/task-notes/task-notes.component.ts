import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddNoteDialogComponent } from './add-note/add-note.component';

interface Note {
  content: string;
  date: Date;
}

@Component({
  selector: 'app-task-notes',
  templateUrl: './task-notes.component.html',
  styleUrls: ['./task-notes.component.css']
})
export class TaskNotesComponent {
  notes: Note[] = []; // Placeholder for notes

  constructor(private dialog: MatDialog) { }

  openNoteDialog() {
    const dialogRef = this.dialog.open(AddNoteDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addNote(result);
      }
    });
  }

  addNote(noteContent: string) {
    const newNote: Note = {
      content: noteContent,
      date: new Date() // Current date and time
    };
    this.notes.push(newNote);
  }
}
