import { Injectable } from '@angular/core';
import { LangDefinition, TranslocoService } from '@ngneat/transloco';
import { filter, map, Observable, switchMap, take } from 'rxjs';
import { EjdaPlayer } from '../../models/player.model';
import { EjdaFirebaseAuthService } from '../firebase/firebase-auth.service';
import { EjdaFirebasePlayersService } from '../firebase/firebase-player.service';

@Injectable({
  providedIn: 'root',
})
export class EjdaLanguageService {
  currentPlayer$: Observable<EjdaPlayer>;

  constructor(
    private readonly firebaseAuthService: EjdaFirebaseAuthService,
    private readonly firebasePlayersService: EjdaFirebasePlayersService,
    private readonly translocoService: TranslocoService
  ) {
    this.currentPlayer$ = this.firebaseAuthService.user$.pipe(
      filter((user) => !!user?.email),
      switchMap((user) =>
        this.firebasePlayersService
          .getPlayer(user?.email!)
          .pipe(map((player) => ({ ...player, id: user?.email! })))
      )
    );

    this.currentPlayer$.pipe(take(1)).subscribe((player) => {
      player.language && this.translocoService.setActiveLang(player.language);
    });
  }

  getAvailableLangs(): string[] {
    return this.translocoService
      .getAvailableLangs()
      .map((lang) => (lang as LangDefinition).label || (lang as string));
  }

  getActiveLang(): Observable<string> {
    return this.translocoService.langChanges$.pipe(
      map(() => this.translocoService.getActiveLang())
    );
  }

  setActiveLang(lang: string): void {
    this.currentPlayer$.pipe(take(1)).subscribe((player) => {
      this.translocoService.setActiveLang(lang);
      this.firebasePlayersService.modifyPlayerLanguage(player.id, lang);
    });
  }
}
