import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.js'
import { TaskWithCompleted } from '../models/task.js'
import { environment } from '../../enviroments/enviroments.js';

interface UpdateNameUser {
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private apiUrl = environment.apiUrl+'/users';

  constructor(private http: HttpClient) {}

  createUser(user: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Observable<User> {
    return this.http.post<User>(
      `${this.apiUrl}`,
      user
    );
  }

  getMe(): Observable<User> {
    return this.http.get<User>(
      `${this.apiUrl}/me`
    );
  }

  getMyTasks(): Observable<TaskWithCompleted[]> {
    return this.http.get<TaskWithCompleted[]>(
      `${this.apiUrl}/myTasks`
    );
  }

  getMyTodayTasks(date: Date): Observable<TaskWithCompleted[]> {
    return this.http.get<TaskWithCompleted[]>(`${this.apiUrl}/myTasks/date/${date.toISOString().split('T')[0]}`);
  }

  getMyPendingTasks(): Observable<TaskWithCompleted[]> {
    return this.http.get<TaskWithCompleted[]>(
      `${this.apiUrl}/myTasks/pending`
    );
  }

  getMyOverdueTasks(): Observable<TaskWithCompleted[]> {
    return this.http.get<TaskWithCompleted[]>(
      `${this.apiUrl}/myTasks/overdue`
    );
  }

  getMyCompletedTasks(): Observable<TaskWithCompleted[]> {
    return this.http.get<TaskWithCompleted[]>(
      `${this.apiUrl}/myTasks/completed`
    );
  }

  updateFirstNameAndLastNameUser(
    data: UpdateNameUser
  ): Observable<User> {
    return this.http.patch<User>(
      `${this.apiUrl}/name`,
      data
    );
  }

  updateEmailUser(email: string): Observable<User> {
    return this.http.patch<User>(
      `${this.apiUrl}/email`,
      email
    );
  }

  changePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/password`,
      {
        currentPassword,
        newPassword
      }
    );
  }
}