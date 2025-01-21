import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { EjdaFirebaseService } from '../shared/firebase/firebase.service';
import { EjdaPlayer } from './score-list.model';

@Component({
  selector: 'ejda-score-list',
  imports: [CommonModule],
  templateUrl: './score-list.component.html',
  styleUrl: './score-list.component.scss',
})
export class EjdaScoreListComponent {
  players$?: Observable<EjdaPlayer[]>;

  constructor(private readonly firebaseService: EjdaFirebaseService) {
    this.firebaseService.loadPlayers();
    this.players$ = this.firebaseService.getPlayers();
  }

  increaseScore(player: EjdaPlayer) {
    this.firebaseService.modifyPlayerScore(player.id, 10);
  }

  decreaseScore(player: EjdaPlayer) {
    this.firebaseService.modifyPlayerScore(player.id, -10);
  }
}
