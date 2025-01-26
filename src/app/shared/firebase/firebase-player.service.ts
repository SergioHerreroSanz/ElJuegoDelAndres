import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  collection,
  CollectionReference,
  doc,
  getDoc,
  getFirestore,
  increment,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  BehaviorSubject,
  from,
  map,
  Observable,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { EjdaPlayer } from '../models/score.model';
import { EjdaFirebaseService } from './firebase.service';

export const PLAYERS_COLLECTION_NAME = 'players';

@Injectable({
  providedIn: 'root',
})
export class EjdaFirebasePlayersService {
  private readonly playersRef: CollectionReference;
  private readonly players$: BehaviorSubject<EjdaPlayer[]> =
    new BehaviorSubject<EjdaPlayer[]>([]);
  private readonly totalScore$: Observable<number> = this.getPlayers().pipe(
    map((players) =>
      (players || []).reduce((acc: number, curr: EjdaPlayer) => {
        return acc + curr.score;
      }, 0)
    )
  );

  constructor(
    private readonly firebaseService: EjdaFirebaseService,
    private readonly router: Router
  ) {
    this.playersRef = collection(
      getFirestore(this.firebaseService.app),
      PLAYERS_COLLECTION_NAME
    );
  }

  getPlayers(): Observable<EjdaPlayer[]> {
    return this.players$.pipe(
      tap((players) => {
        if (!players.length) {
          this.listenPlayers();
        }
      })
    );
  }

  getTotalScore() {
    return this.totalScore$;
  }

  listenPlayers(): void {
    onSnapshot(this.playersRef, (snapshot) => {
      const players = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as EjdaPlayer[];
      this.players$.next(players);
    });
  }

  savePlayer(email: string, nickname: string, score: number): void {
    setDoc(
      doc(
        getFirestore(this.firebaseService.app),
        PLAYERS_COLLECTION_NAME,
        email
      ),
      {
        name: nickname,
        score: score,
      }
    );
  }

  modifyPlayerScore(email: string, valueToAdd: number): void {
    const playerDocRef = doc(this.playersRef, email);

    from(getDoc(playerDocRef))
      .pipe(
        switchMap((doc) => {
          if (doc.exists()) {
            return from(
              updateDoc(playerDocRef, { score: increment(valueToAdd) })
            );
          } else {
            throw new Error(
              'User not found while trying to modify player score'
            );
          }
        }),
        take(1)
      )
      .subscribe();
  }
}
