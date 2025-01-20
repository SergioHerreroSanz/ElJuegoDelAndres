import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  Auth,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { from, map, Observable, catchError, of, switchMap, take } from 'rxjs';
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from 'firebase/firestore';
import {
  EjdaPlayer,
  PLAYERS_COLLECTION_NAME,
} from '../../score-list/score-list.model';

@Injectable({
  providedIn: 'root',
})
export class EjdaFirebaseService {
  private googleProvider = new GoogleAuthProvider();

  app: FirebaseApp;
  private readonly auth: Auth;
  private readonly playersRef: CollectionReference;

  private googleUser?: User;
  private googleToken?: string;

  constructor(private readonly router: Router) {
    this.app = initializeApp(environment.firebaseConfig);
    this.auth = getAuth(this.app);
    this.playersRef = collection(
      getFirestore(this.app),
      PLAYERS_COLLECTION_NAME
    );
  }

  loginWithGoogle(): Observable<User> {
    return from(signInWithPopup(this.auth, this.googleProvider)).pipe(
      map((result) => {
        this.googleToken =
          GoogleAuthProvider.credentialFromResult(result)?.accessToken;
        this.googleUser = result.user;
        return result.user;
      }),
      catchError((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        console.error(
          `Error ${errorCode} for email "${email}": ${errorMessage}`
        );
        // TODO: Add login error warning
        return of(error);
      })
    );
  }

  getUserEmail(): string | null {
    return this.googleUser?.email || null;
  }

  registerWithGoogle(nickname: string) {
    return this.loginWithGoogle().pipe(
      take(1),
      switchMap((user) =>
        // TODO: Add mesage "User registered succesfully"
        // if account already exists, doc will set score to 0 and save the new nickname
        setDoc(
          doc(getFirestore(this.app), PLAYERS_COLLECTION_NAME, user.email!),
          {
            name: nickname,
            score: 0,
          }
        )
      )
    );
  }

  getPlayers(): Observable<EjdaPlayer[]> {
    return of(collection(getFirestore(this.app), PLAYERS_COLLECTION_NAME)).pipe(
      switchMap((collectionRef) => getDocs(collectionRef)),
      map((docs) =>
        docs.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as EjdaPlayer)
        )
      )
    );
  }
}
