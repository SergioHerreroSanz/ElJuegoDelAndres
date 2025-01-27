import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { EjdaPlayer } from '../../shared/models/player.model';
import { MoneyPipe } from '../../shared/pipes/money-pipe.pipe';
import { EjdaFirebasePlayersService } from '../../shared/services/firebase/firebase-player.service';
import { EjdaActiveGoalsListComponent } from '../goals/active-goals-list/active-goals-list.component';

export const SCORE_INCREMENT = 0.1;

@Component({
  selector: 'ejda-score-list',
  imports: [
    CommonModule,
    MoneyPipe,
    TranslocoPipe,
    EjdaActiveGoalsListComponent,
  ],
  templateUrl: './score-list.component.html',
  styleUrl: './score-list.component.scss',
})
export class EjdaScoreListComponent {
  players$: Observable<EjdaPlayer[]>;
  totalScore$: Observable<number>;

  constructor(
    private readonly firebasePlayersService: EjdaFirebasePlayersService
  ) {
    this.players$ = this.firebasePlayersService.getPlayers();
    this.totalScore$ = this.firebasePlayersService.getTotalScore();
  }

  increaseScore(player: EjdaPlayer) {
    this.firebasePlayersService.modifyPlayerScore(player.id, SCORE_INCREMENT);
  }

  decreaseScore(player: EjdaPlayer) {
    if (player.score >= SCORE_INCREMENT)
      this.firebasePlayersService.modifyPlayerScore(
        player.id,
        -SCORE_INCREMENT
      );
  }
}
