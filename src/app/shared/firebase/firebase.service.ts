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
  readonly app: FirebaseApp;

  constructor(private readonly router: Router) {
    this.app = initializeApp(environment.firebaseConfig);
  }
}
