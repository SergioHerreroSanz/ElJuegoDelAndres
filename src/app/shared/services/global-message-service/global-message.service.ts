import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EjdaGlobalMessageService {
  readonly messages$: BehaviorSubject<Map<number, string>> =
    new BehaviorSubject(new Map());
  private i = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private readonly transloco: TranslocoService
  ) {}

  addMessage(message: string, time: number = 5000): number {
    const id = ++this.i;
    const updatedMessages = this.messages$.value;

    updatedMessages.set(id, message);
    this.messages$.next(updatedMessages);

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.removeMessage(id);
      }, time);
    }

    return id;
  }

  addTranslationMessage(key: string, time?: number) {
    const msg = this.transloco.translate(key);
    this.addMessage(msg, time);
  }

  removeMessage(id: number): void {
    const updatedMessages = this.messages$.value;

    updatedMessages.delete(id);

    this.messages$.next(updatedMessages);
  }
}
