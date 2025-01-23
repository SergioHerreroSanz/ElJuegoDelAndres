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
  Subject,
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
import { EjdaFirebasePlayersService } from './firebase-player.service';

@Injectable({
  providedIn: 'root',
})
export class EjdaFirebaseAuthService {
  private readonly googleProvider = new GoogleAuthProvider();
  private readonly auth: Auth;

  readonly user$: Subject<User | null> = new Subject<User | null>();
  readonly isLogedIn$: Subject<boolean | null> = new Subject<boolean | null>();

  constructor(
    private readonly firebaseService: EjdaFirebaseService,
    private readonly firebasePlayersService: EjdaFirebasePlayersService,
    private readonly router: Router
  ) {
    this.auth = getAuth(this.firebaseService.app);
    onAuthStateChanged(this.auth, (user) => {
      this.user$.next(user);
      this.isLogedIn$.next(!!user?.email);
    });
  }

  loginWithEmail(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential) => {
        return this.firebasePlayersService.getPlayers().pipe(
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
        return this.firebasePlayersService.getPlayers().pipe(
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
        this.firebasePlayersService.getPlayers().pipe(
          filter((p) => !!p),
          take(1),
          map((players) => players.find((player) => player.id === email)),
          switchMap((player) => {
            // This code wil update the user nickname if account already exists
            this.firebasePlayersService.savePlayer(
              email,
              nickname,
              player?.score ?? 0
            );
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
        this.firebasePlayersService.getPlayers().pipe(
          filter((p) => !!p),
          take(1),
          map((players) => players.find((player) => player.id === user.email)),
          switchMap((player) => {
            // This code wil update the user nickname if account already exists
            this.firebasePlayersService.savePlayer(
              user.email!,
              nickname,
              player?.score ?? 0
            );
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
      .subscribe(() => {
        this.isLogedIn$.next(false);
        this.user$.next(null);
        this.router.navigate(['login']);
      });
  }
}
