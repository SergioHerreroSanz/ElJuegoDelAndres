import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { EjdaGlobalMessageService } from '../global-message.service';

const animationBefore = {
  opacity: '0',
  padding: '0 12.5%',
  backgroundColor: 'transparent',
  fontSize: '0',
};
const animationAfter = {
  opacity: '1',
  padding: '0.5rem 12.5%',
  backgroundColor: 'gainsboro',
  fontSize: 'inherit',
};

@Component({
  selector: 'ejda-global-message',
  imports: [CommonModule],
  templateUrl: './global-message.component.html',
  styleUrl: './global-message.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style(animationBefore),
        animate('0.5s ease-out', style(animationAfter)),
      ]),
    ]),
    trigger('fadeOut', [
      transition(':leave', [
        style(animationAfter),
        animate('0.5s ease-out', style(animationBefore)),
      ]),
    ]),
  ],
})
export class EjdaGlobalMessageComponent {
  messages$: Observable<string[]>;

  constructor(private readonly gms: EjdaGlobalMessageService) {
    this.messages$ = this.gms.messages$.pipe(
      map((messages) => Array.from(messages.values() || []))
    );
  }
}
