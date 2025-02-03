import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Observable } from 'rxjs';
import { EjdaGoal, EjdaGoalStatus } from '../../../shared/models/goal.model';
import { MoneyPipe } from '../../../shared/pipes/money-pipe.pipe';
import { EjdaFirebaseGoalsService } from '../../../shared/services/firebase/firebase-goal.service';
import { EjdaFirebasePlayersService } from '../../../shared/services/firebase/firebase-player.service';
import { EjdaConfirmModalComponent } from '../../../shared/services/modal/component/confirm-modal/confirm-modal.component';
import { EjdaModalService } from '../../../shared/services/modal/modal.service';
import { EjdaModalResult } from '../../../shared/services/modal/models/modals.model';
import { EjdaNewGoalModalComponent } from '../new-goal-modal/new-goal-modal.component';

@Component({
  selector: 'ejda-goals-list',
  imports: [CommonModule, RouterModule, MoneyPipe, TranslocoPipe],
  templateUrl: './goals-list.component.html',
  styleUrl: './goals-list.component.scss',
})
export class EjdaGoalsListComponent {
  goals$: Observable<EjdaGoal[]>;
  totalScore$: Observable<number>;
  availableStatuses = Object.values(EjdaGoalStatus);

  statusToUpdate = new Map<string, string>();

  constructor(
    protected readonly firebaseGoalsService: EjdaFirebaseGoalsService,
    protected readonly firebasePlayersService: EjdaFirebasePlayersService,
    protected readonly modalService: EjdaModalService
  ) {
    this.goals$ = this.firebaseGoalsService.getGoals();
    this.totalScore$ = this.firebasePlayersService.getTotalScore();
  }

  createGoal() {
    this.modalService.openModal(EjdaNewGoalModalComponent);
  }

  removeGoal(id: string) {
    this.modalService.openModal(EjdaConfirmModalComponent).subscribe((res) => {
      if (res === EjdaModalResult.OK) {
        this.firebaseGoalsService.removeGoal(id);
      }
    });
  }

  getRemainingScore(price: number, totalScore: number) {
    return price - totalScore > 0 ? price - totalScore : 0;
  }

  changeStatus(id: string, currentStatus: string, event: Event) {
    const newStatus = (event?.target as HTMLSelectElement)?.value;
    newStatus !== currentStatus
      ? this.statusToUpdate.set(id, newStatus)
      : this.statusToUpdate.delete(id);
  }

  confirmStatusUpdate() {
    this.statusToUpdate.forEach((value, key, map) => {
      this.firebaseGoalsService.modifyGoalStatus(key, value);
      map.delete(key);
    });
  }
}
