import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { EjdaFirebaseService } from '../shared/firebase/firebase.service';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { from, map, Observable, of, switchMap, tap } from 'rxjs';
import { EjdaPlayer, PLAYERS_COLLECTION_NAME } from './score-list.model';

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
}
