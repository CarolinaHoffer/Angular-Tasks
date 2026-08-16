import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Label } from '../models/label.js'
import { environment } from '../../enviroments/enviroments.js';
 
@Injectable({
  providedIn: 'root'
})
export class LabelService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMyLabels(): Observable<Label[]> {
    return this.http.get<Label[]>(`${this.apiUrl}`);
  }

  createLabel(label: Label): Observable<Label> {
    return this.http.post<Label>(this.apiUrl, label);
  }

  updateLabel(label: Label): Observable<Label> {
    return this.http.patch<Label>(`${this.apiUrl}/${label.id}`, label);
  }

   deleteLabel(labelId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${labelId}`
    );
  }
}