import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskWithCompleted } from '../models/task';
 
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost:8080/tasks';

  constructor(private http: HttpClient) {}

  createTask(task: Task): Observable<Task> {
      return this.http.post<Task>(
        this.apiUrl,
        task
    );
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${taskId}`
    );
  }

  confirmTask(taskId: number, data: {completed: boolean}): Observable<TaskWithCompleted> {
    return this.http.patch<TaskWithCompleted>(
      `${this.apiUrl}/${taskId}/status`,
       data
    );
  }

  updateTitleAndDescriptionAndDueDateTimeTask(
    id: number,
    data: { title: string; description: string, dueDate: Date, dueTime: string }
  ) { console.log(id, data)
    return this.http.put<Task>(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  updateStatusTask(
    id: number,
    completed: boolean
  ) {
    return this.http.patch<Task>(
      `${this.apiUrl}/${id}/status`,
      { completed }
    );
  }

  updateLabelsTask(
    id: number,
    labels: number[]
  ) { console.log(labels)
    return this.http.patch<Task>(
      `${this.apiUrl}/${id}/labels`,
      labels
    );
  }
}