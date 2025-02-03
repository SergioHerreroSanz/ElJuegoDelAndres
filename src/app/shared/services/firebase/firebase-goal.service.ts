import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { BehaviorSubject, from, Observable, switchMap, take, tap } from 'rxjs';
import { EjdaGoal } from '../../models/goal.model';
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

  constructor(private readonly firebaseService: EjdaFirebaseService) {
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

  
  createGoal(data: Partial<EjdaGoal>) {
    from(addDoc(this.goalsRef, data)).pipe(take(1)).subscribe();
  }

  removeGoal(id: string) {
    from(
      deleteDoc(
        doc(getFirestore(this.firebaseService.app), GOALS_COLLECTION_NAME, id)
      )
    )
      .pipe(take(1))
      .subscribe();
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

  modifyGoalStatus(id: string, status: string): void {
    const goalDocRef = doc(this.goalsRef, id);

    from(getDoc(goalDocRef))
      .pipe(
        switchMap((doc) => {
          if (doc.exists()) {
            return from(updateDoc(goalDocRef, { status }));
          } else {
            throw new Error('Goal not found while trying to modify status');
          }
        }),
        take(1)
      )
      .subscribe();
  }
}
