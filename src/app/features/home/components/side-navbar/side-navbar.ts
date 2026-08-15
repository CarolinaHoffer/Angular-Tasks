import { Component,  EventEmitter, Output, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatActionList } from '@angular/material/list';
import { Label } from '../../../../models/label.js';

export type TaskView = 'all' | 'today' | 'pending' | 'overdue' | 'completed';

@Component({
  selector: 'app-side-navbar',
  imports: [MatButtonModule, MatIconModule, MatActionList],
  templateUrl: './side-navbar.html',
  styleUrl: './side-navbar.css'
})
export class SideNavbar {
  @Input() labels: Label[] = [];

  @Output() addTask = new EventEmitter<void>();
  
  selectedView: TaskView = 'all';

  @Output() viewSelected = new EventEmitter<TaskView>();

  selectView(view: TaskView): void {
    this.selectedView = view;
    this.viewSelected.emit(view);
  }

  openAddTaskDialog(): void {
    console.log('Botón de Nueva Tarea clickeado');
    this.addTask.emit();
  }

}