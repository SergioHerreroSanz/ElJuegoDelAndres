import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { EjdaFirebaseService } from '../shared/firebase/firebase.service';
import { EjdaPlayer } from './score-list.model';
import { EjdaActiveGoalsListComponent } from '../goals/active-goals-list/active-goals-list.component';
import { EjdaFirebasePlayersService } from '../shared/firebase/firebase-player.service';

export const SCORE_INCREMENT = 10;

@Component({
  selector: 'ejda-score-list',
  imports: [CommonModule, EjdaActiveGoalsListComponent],
  templateUrl: './score-list.component.html',
  styleUrl: './score-list.component.scss',
})
export class EjdaScoreListComponent {
  players$?: Observable<EjdaPlayer[]>;

  constructor(
    private readonly firebasePlayersService: EjdaFirebasePlayersService
  ) {
    this.players$ = this.firebasePlayersService.getPlayers();
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
