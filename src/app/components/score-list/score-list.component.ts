import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { EjdaFirebasePlayersService } from '../../shared/firebase/firebase-player.service';
import { EjdaPlayer } from '../../shared/models/score.model';
import { MoneyPipe } from '../../shared/pipes/money-pipe.pipe';
import { EjdaActiveGoalsListComponent } from '../goals/active-goals-list/active-goals-list.component';

export const SCORE_INCREMENT = 0.1;

@Component({
  selector: 'ejda-score-list',
  imports: [CommonModule, MoneyPipe, EjdaActiveGoalsListComponent],
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
