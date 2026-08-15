import { Component, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { Label } from '../../../../models/label';
import { TaskCard } from '../task-card/task-card';
import { TaskService } from '../../../../services/task.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialog } from '../confirm-delete-dialog/confirm-delete-dialog';
import { Task, TaskWithCompleted } from '../../../../models/task';


@Component({
  selector: 'app-task-view',
  imports: [TaskCard, MatFormFieldModule,
  MatSelectModule,
  MatIconModule],
  templateUrl: './task-view.html',
  styleUrl: './task-view.css'
})

export class TaskView {
  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}
  @Input() tasks: TaskWithCompleted[] = [];
  @Input() labels: Label[] = [];
  @Output() taskConfirmSave = new EventEmitter<void>();

deleteTask(taskId: number): void {
  const task = this.tasks.find(task => task.id === taskId);

  if (!task) {
    return;
  }

  const dialogRef = this.dialog.open(ConfirmDeleteDialog, {
    width: '400px',
    data: {
      title: 'Borrar tarea',
      message: `¿Estás seguro de que querés borrar "${task.title}"?`
    }
  });

  dialogRef.afterClosed().subscribe(confirmed => {
    if (!confirmed) {
      return;
    }

    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(
          task => task.id !== taskId
        );

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error eliminando tarea:', error);
      }
    });
  });
}

confirmTask(taskId: number): void {

  const task = this.tasks.find(task => task.id === taskId);

  if (!task) {
    return;
  }
  const newStatus : boolean = !Boolean(task.completed);
  console.log('task:', task);
  console.log('completed:', task.completed);
  console.log('typeof:', typeof task.completed);
  console.log('Boolean:', Boolean(task.completed));
  console.log('NOT:', !Boolean(task.completed));
  console.log('New Status:', newStatus);
  

  this.taskService.confirmTask(taskId, {completed: newStatus}).subscribe({
      next: () => {
        this.taskConfirmSave.emit();
      },
      error: (error) => {
        console.error('Error eliminando tarea:', error);
      }
    });
  }



@Output() taskEdit = new EventEmitter<Task>();

editTask(task: Task): void {
  this.taskEdit.emit(task);
}

}