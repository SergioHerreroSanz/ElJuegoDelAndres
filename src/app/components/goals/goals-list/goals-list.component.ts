import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoPipe } from '@ngneat/transloco';
import { map, Observable } from 'rxjs';
import { EjdaGoal, EjdaGoalStatus } from '../../../shared/models/goal.model';
import { MoneyPipe } from '../../../shared/pipes/money-pipe.pipe';
import { EjdaFirebaseGoalsService } from '../../../shared/services/firebase/firebase-goal.service';
import { EjdaFirebasePlayersService } from '../../../shared/services/firebase/firebase-player.service';

@Component({
  selector: 'ejda-goals-list',
  imports: [CommonModule, RouterModule, MoneyPipe, TranslocoPipe],
  templateUrl: './goals-list.component.html',
  styleUrl: './goals-list.component.scss',
})
export class EjdaGoalsListComponent {
  goals$: Observable<EjdaGoal[]>;
  totalScore$: Observable<number>;

  constructor(
    protected readonly firebaseGoalsService: EjdaFirebaseGoalsService,
    protected readonly firebasePlayersService: EjdaFirebasePlayersService
  ) {
    this.goals$ = this.firebaseGoalsService
      .getGoals()
      .pipe(
        map((goals) =>
          goals.filter((goal) => goal.status === EjdaGoalStatus.ACTIVE)
        )
      );
    this.totalScore$ = this.firebasePlayersService.getTotalScore();
  }

  getRemainingScore(price: number, totalScore: number) {
    return price - totalScore > 0 ? price - totalScore : 0;
  }
}
