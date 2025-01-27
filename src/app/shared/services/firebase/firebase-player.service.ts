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
import { EjdaPlayer } from '../../models/player.model';
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

  getPlayer(email: string): Observable<EjdaPlayer> {
    return from(
      getDoc(
        doc(
          getFirestore(this.firebaseService.app),
          PLAYERS_COLLECTION_NAME,
          email
        )
      )
    ).pipe(map((doc) => doc.data() as EjdaPlayer));
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
              'User not found while trying to modify score'
            );
          }
        }),
        take(1)
      )
      .subscribe();
  }

  modifyPlayerLanguage(email: string, lang: string): void {
    const playerDocRef = doc(this.playersRef, email);

    from(getDoc(playerDocRef))
      .pipe(
        switchMap((doc) => {
          if (doc.exists()) {
            return from(updateDoc(playerDocRef, { language: lang }));
          } else {
            throw new Error(
              'User not found while trying to modify player language'
            );
          }
        }),
        take(1)
      )
      .subscribe();
  }
}
