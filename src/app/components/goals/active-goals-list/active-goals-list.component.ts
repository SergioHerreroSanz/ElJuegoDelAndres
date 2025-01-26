import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';
import { EjdaFirebaseGoalsService } from '../../../shared/firebase/firebase-goal.service';
import { EjdaFirebasePlayersService } from '../../../shared/firebase/firebase-player.service';
import { EjdaGoal, EjdaGoalStatus } from '../../../shared/models/goal.model';
import { MoneyPipe } from '../../../shared/pipes/money-pipe.pipe';

@Component({
  selector: 'ejda-active-goals-list',
  imports: [CommonModule, RouterModule, MoneyPipe],
  templateUrl: './active-goals-list.component.html',
  styleUrl: './active-goals-list.component.scss',
})
export class EjdaActiveGoalsListComponent {
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
