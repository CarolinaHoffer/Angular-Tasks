export interface Task {
  title: string;
  description: string;
  dueDate?: Date;
  dueTime?: string;
  labelIds?: number[];
}

