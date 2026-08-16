import { Component, Inject, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Label } from '../../../../models/label';
import { LabelSelector } from '../label-selector/label-selector';

import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Task } from '../../../../models/taskWithoutId';

@Component({
  selector: 'app-add-task-modal',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    LabelSelector,
    MatTimepickerModule,
    MatDatepickerModule,
  ],
  templateUrl: './add-task-modal.html',
  styleUrl: './add-task-modal.css'
})
export class AddTaskModal {

  taskForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    dueDate: new FormControl(''),
    dueTime: new FormControl<Date | null>(null)
  });

  @Output() addLabelEvent = new EventEmitter<number>();

  selectedLabelIds: number[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddTaskModal>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      labels: Label[];
      task?: any;
    }
  ) {}

  ngOnInit(): void {
    // Si existe task, estamos editando
    if (this.data.task) {
      const task = this.data.task;

      this.taskForm.patchValue({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate
          ? task.dueDate
          : '',
        dueTime: task.dueTime
          ? this.parseTime(task.dueTime)
          : null
      });

      this.selectedLabelIds = task.labels?.map(
        (label: Label) => label.id
      ) ?? [];
    }
  }

  private parseTime(time: string): Date {
    const [hours, minutes, seconds = 0] = time.split(':').map(Number);

    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);

    return date;
  }

  submit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const dueTime = this.taskForm.value.dueTime;

    const task: Task = {
      title: this.taskForm.value.title ?? '',
      description: this.taskForm.value.description ?? '',

      dueDate: this.taskForm.value.dueDate
        ? new Date(this.taskForm.value.dueDate)
        : undefined,

      dueTime: dueTime
        ? dueTime.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        : undefined,

      labelIds: this.selectedLabelIds
    };

    this.dialogRef.close(task);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  addLabel():void {
    this.addLabelEvent.emit();
  }
}