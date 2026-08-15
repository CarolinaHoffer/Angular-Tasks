import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLabelModal } from './add-label-modal';

describe('AddLabelModal', () => {
  let component: AddLabelModal;
  let fixture: ComponentFixture<AddLabelModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLabelModal],
    }).compileComponents();

    fixture = TestBed.createComponent(AddLabelModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
