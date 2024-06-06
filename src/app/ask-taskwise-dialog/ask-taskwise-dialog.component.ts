import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { TaskwiseAIService } from '../services/task-wise-ai.service';
import { TaskService } from '../services/task.service';
import { Priority } from '../objects/priority.model';
import { Status } from '../objects/status.model';
import { Task } from '../objects/task.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Speech } from 'openai/resources/audio/speech';
import OpenAI from 'openai';
import { environment } from 'src/environment';
import { fstat, fsync } from 'fs';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
@Component({
  selector: 'app-ask-taskwise-dialog',
  templateUrl: './ask-taskwise-dialog.component.html',
  styleUrls: ['./ask-taskwise-dialog.component.css']
})
export class AskTaskwiseDialogComponent {
  responseFromAI: string = "";
prompt: string = ""
  newTask!: Task;
  isWaiting = false;
  speech: any
  constructor(private taskwiseAIService: TaskwiseAIService, private taskService: TaskService, @Inject(MAT_BOTTOM_SHEET_DATA) public task: Task,
    private dialogRef: MatBottomSheetRef<AskTaskwiseDialogComponent>) { 

      this.speech = new OpenAI({
        baseURL: 'http://api.openai.com/v1/audio/speech', 
        apiKey: environment.taskwiseApiKey,
        dangerouslyAllowBrowser: true
      })
    }

  sendMessageToAI(prompt: string): void {
    this.prompt = prompt
    this.isWaiting = true;
    this.taskwiseAIService.sendMessage(prompt).subscribe(response => {
      if(response)
        this.isWaiting = false;
      this.responseFromAI = response.choices[0].message.content; // Extracting the task details from the response
//       const mp3 = this.speech.audio.speech.create({
//   model: "tts-1",
//     voice: "alloy",
//     input: this.responseFromAI,
// })
// console.log(mp3);
// const buffer = Buffer.from( mp3.arrayBuffer());

      // Logging the response content
     
    });
  }



  regenerateResponse(): void {
    // Clear the current response and send a new prompt to the AI
    this.responseFromAI = "";
    this.sendMessageToAI('Can you be more detailed?'+this.prompt )
    // Provide more specific details about the task in the prompt
    
  }
  playAudio(audio: ArrayBuffer): void {
    if (audio) {
      // Use an HTML audio element to play the audio
      const audioBlob = new Blob([audio], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioUrl);
      audioElement.play();
    }
  }
  closeDialog(): void {
    // Close the dialog and pass the updated task back to the parent component
    this.dialogRef.dismiss();
  }
}
