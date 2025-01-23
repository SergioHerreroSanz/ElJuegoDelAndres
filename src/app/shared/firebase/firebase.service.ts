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

@Injectable({
  providedIn: 'root',
})
export class EjdaFirebaseService {
  private readonly googleProvider = new GoogleAuthProvider();

  private readonly app: FirebaseApp;
  private readonly auth: Auth;
  private readonly playersRef: CollectionReference;

  readonly user$: BehaviorSubject<User | null | undefined> =
    new BehaviorSubject<User | null | undefined>(undefined);
  private readonly players$: BehaviorSubject<EjdaPlayer[]> =
    new BehaviorSubject<EjdaPlayer[]>([]);

  constructor(private readonly router: Router) {
    this.app = initializeApp(environment.firebaseConfig);
    this.auth = getAuth(this.app);

    this.playersRef = collection(
      getFirestore(this.app),
      PLAYERS_COLLECTION_NAME
    );

    onAuthStateChanged(this.auth, (user) => this.user$.next(user));
  }

  loginWithEmail(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential) => {
        return this.getPlayers().pipe(
          filter((p) => !!p.length),
          take(1),
          map((players) => players.find((player) => player.id === email)),
          switchMap((player) => {
            if (player) {
              return of(userCredential.user);
            } else {
              this.logout();
              throw new Error('User not registered. Try registering first');
            }
          })
        );
      })
    );
  }

  loginWithGoogle(): Observable<User> {
    return this.getGoogleUserFromPopup().pipe(
      switchMap((user) => {
        return this.getPlayers().pipe(
          filter((p) => !!p.length),
          take(1),
          map((players) => players.find((player) => player.id === user.email)),
          switchMap((player) => {
            if (player) {
              return of(user);
            } else {
              this.logout();
              throw new Error('User not registered. Try registering first');
            }
          })
        );
      })
    );
  }

  registerWithEmail(
    email: string,
    password: string,
    nickname: string
  ): Observable<User> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      switchMap((userCredential) =>
        this.getPlayers().pipe(
          filter((p) => !!p),
          take(1),
          map((players) => players.find((player) => player.id === email)),
          switchMap((player) => {
            // This code wil update the user nickname if account already exists
            this.savePlayer(email, nickname, player?.score ?? 0);
            return of(userCredential.user);
          })
        )
      ),
      catchError((e) => this.throwGoogleError(e))
    );
  }

  registerWithGoogle(nickname: string): Observable<User> {
    return this.getGoogleUserFromPopup().pipe(
      switchMap((user) =>
        this.getPlayers().pipe(
          filter((p) => !!p),
          take(1),
          map((players) => players.find((player) => player.id === user.email)),
          switchMap((player) => {
            // This code wil update the user nickname if account already exists
            this.savePlayer(user.email!, nickname, player?.score ?? 0);
            return of(user);
          })
        )
      ),
      catchError((e) => this.throwGoogleError(e))
    );
  }

  getGoogleUserFromPopup(): Observable<User> {
    return from(setPersistence(this.auth, browserLocalPersistence)).pipe(
      switchMap(() =>
        from(signInWithPopup(this.auth, this.googleProvider)).pipe(
          map((googleUser) => googleUser.user),
          catchError((e) => this.throwGoogleError(e))
        )
      )
    );
  }

  throwGoogleError(e: any): Observable<User> {
    throw new Error(
      `Error ${e?.code} for email "${e?.customData?.email}": ${e.message}`
    );
  }

  logout(): void {
    from(signOut(this.auth))
      .pipe(take(1))
      .subscribe(() => this.router.navigate(['login']));
  }

  savePlayer(email: string, nickname: string, score: number): void {
    setDoc(doc(getFirestore(this.app), PLAYERS_COLLECTION_NAME, email), {
      name: nickname,
      score: score,
    });
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

  listenPlayers(): void {
    onSnapshot(this.playersRef, (snapshot) => {
      const players = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as EjdaPlayer[];
      this.players$.next(players);
    });
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
}
