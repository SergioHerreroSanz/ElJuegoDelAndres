import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  Auth,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
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
  catchError,
  filter,
  from,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  EjdaPlayer,
  PLAYERS_COLLECTION_NAME,
} from '../../score-list/score-list.model';
import { EjdaFirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class EjdaFirebasePlayersService {
  private readonly playersRef: CollectionReference;
  private readonly players$: BehaviorSubject<EjdaPlayer[]> =
    new BehaviorSubject<EjdaPlayer[]>([]);

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
