import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Task, TaskWithCompleted } from '../../../../models/task';
import { MatMenuModule } from '@angular/material/menu';
import { DatePipe } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-task-card',
  imports: [
    MatIconModule,
    MatButtonModule,
    DatePipe,
    MatMenuModule,
    MatTooltip
  ],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css'
})
export class TaskCard {

  ngOnInit(): void {
    console.log('TASK:', this.task);
  }
  @Input() task!: TaskWithCompleted;

  @Output() taskDeleted = new EventEmitter<number>();
  @Output() taskEdit = new EventEmitter<Task>();
  @Output() taskConfirm = new EventEmitter<number>();


  deleteTask(): void {
    this.taskDeleted.emit(this.task.id);
  }
  editTask(): void {
    this.taskEdit.emit(this.task);
  }
  confirm():void {
    this.taskConfirm.emit(this.task.id);
  }
}