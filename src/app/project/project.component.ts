import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project } from '../objects/project.model';; // Assuming you have a Project model

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent {
  @Input() project!: Project;;
  @Output() viewDetails = new EventEmitter<Project>();

  onViewDetails() {
    this.viewDetails.emit(this.project);
  }
}
