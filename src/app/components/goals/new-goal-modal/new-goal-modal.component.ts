import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { EjdaGoalStatus } from '../../../shared/models/goal.model';
import { EjdaFirebaseGoalsService } from '../../../shared/services/firebase/firebase-goal.service';
import { EjdaModalService } from '../../../shared/services/modal/modal.service';

@Component({
  selector: 'ejda-new-goal-modal',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslocoPipe],
  templateUrl: './new-goal-modal.component.html',
  styleUrl: './new-goal-modal.component.scss',
})
export class EjdaNewGoalModalComponent {
  availableStatuses = Object.values(EjdaGoalStatus);
  goalForm: FormGroup;

  constructor(
    protected readonly firebaseGoalsService: EjdaFirebaseGoalsService,
    protected readonly modalService: EjdaModalService,
    protected readonly fb: FormBuilder
  ) {
    this.goalForm = fb.group({
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      status: ['', Validators.required],
    });
  }

  createGoal() {
    if (this.goalForm.valid) {
      this.firebaseGoalsService.createGoal(this.goalForm.value);
      this.modalService.closeModal();
    }
  }
}
