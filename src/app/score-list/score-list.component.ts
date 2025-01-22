import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { EjdaFirebaseService } from '../shared/firebase/firebase.service';
import { EjdaPlayer } from './score-list.model';

export const SCORE_INCREMENT = 10;

@Component({
  selector: 'ejda-score-list',
  imports: [CommonModule],
  templateUrl: './score-list.component.html',
  styleUrl: './score-list.component.scss',
})
export class EjdaScoreListComponent {
  players$?: Observable<EjdaPlayer[]>;

  constructor(private readonly firebaseService: EjdaFirebaseService) {
    this.players$ = this.firebaseService.getPlayers();
  }

  increaseScore(player: EjdaPlayer) {
    this.firebaseService.modifyPlayerScore(player.id, SCORE_INCREMENT);
  }

  decreaseScore(player: EjdaPlayer) {
    if (player.score >= SCORE_INCREMENT)
      this.firebaseService.modifyPlayerScore(player.id, -SCORE_INCREMENT);
  }
}
