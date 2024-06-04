import { Priority } from "./priority.model";

export interface Task {
  project: string;
    title: string;
    description: string;
    dueDate: string;
    priority: Priority; // Updated property
    assignedTo?: string;
    assignedBy?: string;
    completed?: boolean;
  }