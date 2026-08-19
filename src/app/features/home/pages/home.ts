import { Component, ChangeDetectorRef, ViewChild  } from '@angular/core';
import { SideNavbar } from '../components/side-navbar/side-navbar';
import { TopNavbar } from '../components/top-navbar/top-navbar';
import { AddTaskModal } from '../components/add-task-modal/add-task-modal';
import { AddLabelModal } from '../components/add-label-modal/add-label-modal';
import { MatDialog } from '@angular/material/dialog';
import { LabelService } from '../../../services/label.service';
import { TaskService } from '../../../services/task.service';
import { UserService } from '../../../services/userService';
import { Label } from '../../../models/label.js';
import { Task, TaskWithCompleted } from '../../../models/task';
import { TaskView } from "../components/task-view/task-view";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmDeleteDialog } from '../components/confirm-delete-dialog/confirm-delete-dialog';
import { MatTooltip } from '@angular/material/tooltip';
import { forkJoin } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';


export type TaskViewOptions = 'all' | 'today' | 'pending' | 'overdue' | 'completed';

@Component({
  selector: 'app-home',
  imports: [SideNavbar, TopNavbar, MatSidenavModule, MatMenuModule, MatButtonModule, TaskView, MatFormFieldModule, MatIconModule, MatSelectModule, ReactiveFormsModule, MatInputModule],
  templateUrl: 'home.html',
  styleUrl: 'home.css',
})
export class Home {
  isMobile = false;
  isOver = false;

  constructor(
    private dialog: MatDialog, 
    private labelService: LabelService, 
    private taskService: TaskService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver
      .observe([
        '(max-width: 768px)',
        '(min-width: 769px) and (max-width: 1135px)'
      ])
      .subscribe(result => {
        this.isMobile = result.breakpoints['(max-width: 768px)'];
        this.isOver = result.breakpoints['(min-width: 769px) and (max-width: 1135px)'];
      });
  }

  searchForm = new FormGroup({
    search: new FormControl('', []),
    labels: new FormControl<number | null>(null)
  });
  
  labels: Label[] = [];
  tasks: TaskWithCompleted[] = [];
  selectedView: TaskViewOptions = 'all';
  filteredTasks: TaskWithCompleted[] = [];

  ngOnInit(): void {
    this.getAllLabels();
    this.selectView('all');
    this.searchForm.valueChanges.subscribe(() => {
      this.onChange();
  });
  }

  getAllLabels(): void {
    this.labelService.getMyLabels().subscribe({
      next: (labels) => {
        this.labels = labels;
      },
      error: (error) => {
        console.error('Error obteniendo labels:', error);
      }
    });
  }

  @ViewChild('sidenav') sidenav!: MatSidenav;

  toggleSideNavbar(): void {
    this.sidenav.toggle();
  }

  onChange(): void {
    const { search, labels } = this.searchForm.value;

    let filteredTasks = [...this.tasks];

    if (search) {
      const searchTerm = search.toLowerCase().trim();

      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm)
      );
    }

    if (labels !== null) {
      filteredTasks = filteredTasks.filter(task =>
        task.labels?.some(label => label.id === labels)
      );
    }
    console.log(this.tasks, filteredTasks)
    this.filteredTasks = filteredTasks;
    this.cdr.detectChanges();
  }

  openAddTaskModal(): void {
    const dialogRef = this.dialog.open(AddTaskModal, {
      width: '500px',
      data: {
        labels: this.labels
      },
    });

    dialogRef.componentInstance.addLabelEvent.subscribe(() => {
      this.openAddLabelModalFromAddTask(dialogRef);
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.createTask(result).subscribe({
        next: (task) => {
          console.log('Tarea creada:', task);
          this.selectView(this.selectedView);
        },
        error: (error) => {
          console.error('Error creando tarea:', error);
        }
      });
      }
    });
  } 

  editTask(task: Task): void {
    const dialogRef = this.dialog.open(AddTaskModal, {
      width: '500px',
      data: {
        task,
        labels: this.labels
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      forkJoin({
        task: this.taskService.updateTitleAndDescriptionAndDueDateTimeTask(task.id, {
          title: result.title,
          description: result.description,
          dueDate: result.dueDate,
          dueTime: result.dueTime
        }),
        labels: this.taskService.updateLabelsTask(
          task.id,
          result.labelIds
        ) 
      }).subscribe({
        next: () => {
          this.selectView(this.selectedView);
        },
        error: (error) => {
          console.error('Error editando tarea:', error);
        }
      });
    });
  }

  openAddLabelModalFromAddTask(taskDialogRef: MatDialogRef<AddTaskModal>): void {
  const dialogRef = this.dialog.open(AddLabelModal, {
    width: '500px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.labelService.createLabel(result).subscribe({
        next: (label) => {
          this.labels = [...this.labels, label];

          taskDialogRef.componentInstance.data.labels = this.labels;
        }
      });
    }
  });
}

  openAddLabelModal(): void {
  const dialogRef = this.dialog.open(AddLabelModal, {
    width: '500px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.labelService.createLabel(result).subscribe({
        next: (label) => {
          console.log('Label creada:', label);
          this.labels = [...this.labels, label];
        },
        error: (error) => {
          console.error('Error creando label:', error);
        }
      });
    }
    });
  }

  editLabel(): void {
    const labelId = this.searchForm.controls.labels.value;
    if (labelId == null) {
      return;
    }
    const label = this.labels.find(label => label.id === labelId);

    if (!label) {
      return;
    }
    const dialogRef = this.dialog.open(AddLabelModal, {
      width: '500px',
      data: {
        label: label
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       this.labelService.updateLabel(result).subscribe({
        next: (label) => {
          console.log('Label editada:', label);
          this.labels = [...this.labels, label];
          this.getAllLabels();
          this.selectView(this.selectedView);
        },
        error: (error) => {
          console.error('Error editando label:', error);
        }
      });
      }
    });
  }
deleteLabel(): void {
  const labelId = this.searchForm.controls.labels.value;
  if (labelId == null) { return; }

  const label = this.labels.find(label => label.id === labelId);
  if (!label) { return; }

  const dialogRef = this.dialog.open(ConfirmDeleteDialog, {
    width: '400px',
    data: {
      title: 'Borrar label',
      message: `¿Estás seguro de que querés borrar "${label.name}"?`
    }
  });

  dialogRef.afterClosed().subscribe(confirmed => {
    if (!confirmed) { return; }
    this.labelService.deleteLabel(labelId).subscribe({
      next: () => {
        console.log('Label eliminada:', label);
        this.labels = this.labels.filter(
          existingLabel => existingLabel.id !== labelId
        );
        this.searchForm.controls.labels.setValue(null);
        this.selectView(this.selectedView);
      },
      error: (error) => {
        console.error('Error eliminando label:', error);
      }
    });
  });
}

    taskConfirmSave(): void {
      this.selectView(this.selectedView);
    }

  private setTasks(tasks: TaskWithCompleted[]): void {
    this.tasks = tasks;
    this.onChange();
    this.cdr.detectChanges();
  }

  selectView(view: TaskViewOptions): void {
    this.selectedView = view;
    switch (view) {
    case 'all':
      this.userService.getMyTasks().subscribe({
        next: (tasks) => this.setTasks(tasks),
        error: (error) => console.error('Error obteniendo tareas:', error)
      });
      break;

    case 'today':
      this.userService.getMyTodayTasks(new Date()).subscribe({
        next: (tasks) => this.setTasks(tasks),
        error: (error) => {
          console.error('Error obteniendo tareas:', error);
        }
      });
      break;

    case 'pending':
      this.userService.getMyPendingTasks().subscribe({
        next: (tasks) => this.setTasks(tasks),
        error: (error) => console.error('Error obteniendo tareas pendientes:', error)
      });
      break;

    case 'overdue':
      this.userService.getMyOverdueTasks().subscribe({
        next: (tasks) => this.setTasks(tasks),
        error: (error) => console.error('Error obteniendo tareas atrasadas:', error)
      });
      break;

    case 'completed':
      this.userService.getMyCompletedTasks().subscribe({
        next: (tasks) => this.setTasks(tasks),
        error: (error) => console.error('Error obteniendo tareas completadas:', error)
      });
      break;
    }
    if (this.isMobile) {
      this.sidenav.close();
    }
  }

}