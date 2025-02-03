import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
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
import {
  BehaviorSubject,
  catchError,
  from,
  Observable,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { EjdaGoal } from '../../models/goal.model';
import { EjdaGlobalMessageService } from '../global-message-service/global-message.service';
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
    private readonly gms: EjdaGlobalMessageService,
    private readonly transloco: TranslocoService
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
    onSnapshot(
      this.goalsRef,
      (snapshot) => {
        const players = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as EjdaGoal[];
        this.goals$.next(players);
      },
      () => this.throwError('messages.goals.error.listen')
    );
  }

  createGoal(data: Partial<EjdaGoal>) {
    from(addDoc(this.goalsRef, data))
      .pipe(
        take(1),
        catchError(() => this.throwError('messages.goals.error.create'))
      )
      .subscribe(() =>
        this.gms.addTranslationMessage('messages.goals.success.create')
      );
  }

  removeGoal(id: string) {
    from(
      deleteDoc(
        doc(getFirestore(this.firebaseService.app), GOALS_COLLECTION_NAME, id)
      )
    )
      .pipe(
        take(1),
        catchError(() => this.throwError('messages.goals.error.remove'))
      )
      .subscribe(() => this.printMessage('messages.goals.success.remove'));
  }

  saveGoal(email: string, nickname: string, score: number): void {
    from(
      setDoc(
        doc(
          getFirestore(this.firebaseService.app),
          GOALS_COLLECTION_NAME,
          email
        ),
        { name: nickname, score: score }
      )
    )
      .pipe(
        take(1),
        catchError(() => this.throwError('messages.goals.error.save'))
      )
      .subscribe(() => this.printMessage('messages.goals.success.save'));
  }

  modifyGoalStatus(id: string, status: string): void {
    const goalDocRef = doc(this.goalsRef, id);

    from(getDoc(goalDocRef))
      .pipe(
        take(1),
        switchMap(() => from(updateDoc(goalDocRef, { status })).pipe(take(1))),
        catchError(() => this.throwError('messages.goals.error.modifyStatus'))
      )
      .subscribe(() =>
        this.printMessage('messages.goals.success.modifyStatus')
      );
  }

  throwError(key: string): any {
    this.printMessage(key);
    throw new Error(this.transloco.translate(key));
  }

  printMessage(key: string): any {
    this.gms.addTranslationMessage(key);
  }
}
