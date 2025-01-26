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
import { BehaviorSubject, from, Observable, switchMap, take, tap } from 'rxjs';
import { EjdaGoal } from '../models/goal.model';
import { EjdaFirebaseService } from './firebase.service';

export const GOALS_COLLECTION_NAME = 'goals';

@Injectable({
  providedIn: 'root',
})
export class EjdaFirebaseGoalsService {
  private readonly goalsRef: CollectionReference;
  private readonly goals$: BehaviorSubject<EjdaGoal[]> = new BehaviorSubject<
    EjdaGoal[]
  >([]);

  constructor(
    private readonly firebaseService: EjdaFirebaseService,
    private readonly router: Router
  ) {
    this.goalsRef = collection(
      getFirestore(this.firebaseService.app),
      GOALS_COLLECTION_NAME
    );
  }

  getGoals(): Observable<EjdaGoal[]> {
    return this.goals$.pipe(
      tap((players) => {
        if (!players.length) {
          this.listenGoals();
        }
      })
    );
  }

  listenGoals(): void {
    onSnapshot(this.goalsRef, (snapshot) => {
      const players = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as EjdaGoal[];
      this.goals$.next(players);
    });
  }

  saveGoal(email: string, nickname: string, score: number): void {
    setDoc(
      doc(getFirestore(this.firebaseService.app), GOALS_COLLECTION_NAME, email),
      {
        name: nickname,
        score: score,
      }
    );
  }

  modifyPlayerScore(email: string, valueToAdd: number): void {
    const playerDocRef = doc(this.goalsRef, email);

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
