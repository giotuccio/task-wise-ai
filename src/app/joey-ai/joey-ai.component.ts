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
  selector: 'app-joey-ai',
  templateUrl: './joey-ai.component.html',
  styleUrls: ['./joey-ai.component.css']
})
export class JoeyAiComponent {
  responseFromAI: string = "";
  previousFromAI =this.responseFromAI
  prompt: string = ""
    newTask!: Task;
    isWaiting = false;
    isJoeySpeech = false;
    speech: any;
    generatingSpeech = ""

    constructor(private taskwiseAIService: TaskwiseAIService, private taskService: TaskService) { 
  
        this.speech = new OpenAI({
          baseURL: 'http://api.openai.com/v1/audio/speech', 
          apiKey: environment.taskwiseApiKey,
          dangerouslyAllowBrowser: true
        })
      }
  
    sendMessageToAI(prompt: string): void {
      this.prompt = prompt
      this.isWaiting = true;

      this.taskwiseAIService.messageJoeyAI(prompt).subscribe(response => {
        if(response)
          this.isWaiting = false;
        this.responseFromAI = response.choices[0].message.content; // Extracting the task details from the response

        if(this.responseFromAI){
          this.playAudio()
        }
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
  playMaybe(): void{
    const requestData = {
      text: this.responseFromAI,
      model_id: "9agWBYiLgsFrRodHvEj9",
      voice_settings: {
        stability: 123,
        similarity_boost: 123,
        style: 123,
        use_speaker_boost: true
      },
      pronunciation_dictionary_locators: [
        {
          pronunciation_dictionary_id: "<string>",
          version_id: "<string>"
        }
      ],
      seed: 123,
      previous_text: "<string>",
      next_text: "<string>",
      previous_request_ids: ["<string>"],
      next_request_ids: ["<string>"]
    };

    this.taskwiseAIService.joeyToSpeech(requestData).subscribe(
      response => {
        console.log(response);
        const audioBlob = new Blob([response], { type: 'audio/mpg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioElement = new Audio(audioUrl);
        audioElement.play();
      },
      error => {
        console.error(error);
      }
    );
  }
  
  
    regenerateResponse(): void {
      // Clear the current response and send a new prompt to the AI
      this.responseFromAI = "";
      this.sendMessageToAI('Can you be more detailed?'+this.prompt )
      // Provide more specific details about the task in the prompt
      
    }
    playAudio(): void {
      this.taskwiseAIService.textToSpeech(this.responseFromAI).subscribe((response) => {
        this.generatingSpeech = "Generating Voice "
      
        console.log(response); // See what's actually being returned.
        if(response){
          this.generatingSpeech = ""
        this.isJoeySpeech = true;
        const audioBlob = new Blob([response], { type: 'audio/mpg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioElement = new Audio(audioUrl);
        audioElement.play();}
      });
    }
    
    closeDialog(): void {
      // Close the dialog and pass the updated task back to the parent component
    }
}
