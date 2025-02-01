import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { Observable } from 'rxjs';
import { EjdaLanguageService } from '../../shared/services/language/language.service';

@Component({
  selector: 'ejda-language-selector',
  imports: [CommonModule, TranslocoPipe],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss',
})
export class EjdaLanguageSelectorComponent {
  readonly availableLangs: string[];
  readonly activeLang$: Observable<string>;
  displaySelector: boolean = false;

  constructor(private readonly languageService: EjdaLanguageService) {
    this.activeLang$ = this.languageService.getActiveLang();
    this.availableLangs = this.languageService.getAvailableLangs();
  }

  toggleSelector() {
    this.displaySelector = !this.displaySelector;
  }

  changeLanguage(lang: string): void {
    this.displaySelector = false;
    this.languageService.setActiveLang(lang);
  }
}
