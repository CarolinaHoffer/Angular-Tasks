import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef  } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ColorPickerDirective} from 'ngx-color-picker';

export interface LabelModalData {
  label?: {
    id: number;
    name: string;
    color: string;
    icon: string;
  };
}

@Component({
  selector: 'app-add-label-modal',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIcon,
    ColorPickerDirective,
  ],
  templateUrl: './add-label-modal.html',
  styleUrl: './add-label-modal.css'
})
export class AddLabelModal {

  @ViewChild(ColorPickerDirective)
  colorPicker!: ColorPickerDirective;

  colorPickerOpen = false;
  
  toggleColorPicker(): void {
  if (this.colorPickerOpen) {
    this.colorPicker.closeDialog();
    this.colorPickerOpen = false;
  } else {
    this.colorPicker.openDialog();
    this.colorPickerOpen = true;
  }
}

  labelForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(50)
    ]),
    color: new FormControl('#2563EB', [
      Validators.required
    ]),
    icon: new FormControl('label', [
      Validators.required
    ])
  });

  constructor(
    private dialogRef: MatDialogRef<AddLabelModal>,
    @Inject(MAT_DIALOG_DATA) public data: LabelModalData
  ) {
    if (data?.label) {
      this.labelForm.patchValue({
        name: data.label.name,
        color: data.label.color,
        icon: data.label.icon
      });
    }
  }

  get isEditing(): boolean {
    return !!this.data?.label;
  }

  onSubmit(): void {
    if (this.labelForm.invalid) {
      this.labelForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close({
      ...this.labelForm.value,
      id: this.data?.label?.id
    });
  }

  close(): void {
    this.dialogRef.close();
  }

   iconSearch = new FormControl('');

  // Material Symbols disponibles para seleccionar.
  icons: string[] = [
    'home',
    'work',
    'school',
    'shopping_cart',
    'favorite',
    'fitness_center',
    'commute',
    'restaurant',
    'flight',
    'calendar_month',
    'attach_money',
    'pets',
    'music_note',
    'movie',
    'sports_soccer',
    'book',
    'computer',
    'phone',
    'email',
    'star',
    'check_circle',
    'warning',
    'info',
    'settings',
    'person',
    'group',
    'event',
    'schedule',
    'location_on',
    'place',
    'local_cafe',
    'local_hospital',
    'local_grocery_store',
    'directions_car',
    'directions_bus',
    'train',
    'bike_scooter',
    'flight_takeoff',
    'flight_land',
    'beach_access',
    'park',
    'restaurant_menu',
    'cake',
    'celebration',
    'sports',
    'sports_basketball',
    'sports_tennis',
    'sports_gymnastics',
    'menu_book',
    'school',
    'language',
    'translate',
    'code',
    'terminal',
    'bug_report',
    'build',
    'construction',
    'design_services',
    'palette',
    'brush',
    'camera_alt',
    'photo',
    'videocam',
    'headphones',
    'mic',
    'phone_android',
    'laptop',
    'desktop_windows',
    'cloud',
    'folder',
    'description',
    'file_copy',
    'download',
    'upload',
    'lock',
    'key',
    'security',
    'visibility',
    'notifications',
    'chat',
    'comment',
    'mail',
    'call',
    'link',
    'share',
    'bookmark',
    'flag',
    'label',
    'task',
    'list',
    'check',
    'close',
    'add',
    'edit',
    'delete',
    'search',
    'filter_list'
  ];


  get filteredIcons(): string[] {
    const search = this.iconSearch.value?.toLowerCase().trim();

    if (!search) {
      return this.icons;
    }

    return this.icons.filter(icon =>
      icon.toLowerCase().includes(search)
    );
  }

  selectIcon(icon: string): void {
    this.labelForm.controls.icon.setValue(icon);
  }
}