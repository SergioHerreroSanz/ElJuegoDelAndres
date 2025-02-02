import { UpperCasePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { EjdaUserLogoutComponent } from './components/auth/user-logout/user-logout.component';
import { EjdaLanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { EjdaGlobalMessageComponent } from './shared/services/global-message-service/component/global-message.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    UpperCasePipe,
    TranslocoPipe,
    EjdaLanguageSelectorComponent,
    EjdaUserLogoutComponent,
    EjdaGlobalMessageComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [],
})
export class AppComponent implements OnInit {
  @HostListener('window:resize')
  onResize() {
    this.setHeight();
  }

  constructor(
    private readonly el: ElementRef,
    private readonly renderer: Renderer2
  ) {}

  ngOnInit() {
    this.setHeight();
  }

  private setHeight() {
    const height = window.innerHeight + 'px';
    this.renderer.setStyle(this.el.nativeElement, 'height', height);
  }
}
