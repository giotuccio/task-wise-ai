import { Priority } from "./priority.model";
import { Status } from "./status.model";

export interface Task {
  id: string;
  project: string;
    title: string;
    description: string;
    dueDate: string;
    priority: Priority; // Updated property
    status: Status,
    assignedTo?: string;
    assignedBy?: string;
    duration?: number;
    completed?: boolean;
  }