import { Label } from "./label";
export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate?: Date;
  dueTime?: string;
  labels?: Label[];
}

export interface TaskWithotId {
  title: string;
  description: string;
  dueDate?: Date;
  dueTime?: string;
  labelIds?: number[];
}

export interface TaskWithCompleted {
  id: number;
  title: string;
  description: string;
  dueDate?: Date;
  dueTime?: string;
  labels?: Label[];
  completed: boolean;
}
