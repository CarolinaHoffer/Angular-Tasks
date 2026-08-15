import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';

import { Label } from '../../../../models/label';

@Component({
  selector: 'app-label-selector',
  imports: [
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatMenuModule,
    MatTooltip
  ],
  templateUrl: './label-selector.html',
  styleUrl: './label-selector.css'
})
export class LabelSelector {

  @Input() labels: Label[] = [];

  @Input() selectedLabelIds: number[] = [];

  @Output() selectedLabelIdsChange = new EventEmitter<number[]>();

  @Output() addLabelEvent = new EventEmitter<void>();

  addLabel(): void {
    this.addLabelEvent.emit();
  }

  toggleLabel(labelId: number): void {
    if (this.selectedLabelIds.includes(labelId)) {
      this.removeLabel(labelId);
      return;
    }

    this.selectedLabelIdsChange.emit([
      ...this.selectedLabelIds,
      labelId
    ]);
  }

  removeLabel(labelId: number): void {
    this.selectedLabelIdsChange.emit(
      this.selectedLabelIds.filter(id => id !== labelId)
    );
  }

  isSelected(labelId: number): boolean {
    return this.selectedLabelIds.includes(labelId);
  }

  getLabel(labelId: number): Label | undefined {
    return this.labels.find(label => label.id === labelId);
  }
}