import { isPlatformBrowser } from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  Inject,
  Injectable,
  PLATFORM_ID,
  Type,
} from '@angular/core';
import { EMPTY, Observable, Subject } from 'rxjs';
import { EjdaModalComponent } from './component/modal.component';
import { EjdaModalResult } from './models/modals.model';

@Injectable({
  providedIn: 'root',
})
export class EjdaModalService {
  private modalRef?: ComponentRef<any>;
  private response$?: Subject<EjdaModalResult>;

  constructor(
    protected readonly appRef: ApplicationRef,
    protected readonly injector: EnvironmentInjector,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  openModal(component: Type<unknown>): Observable<EjdaModalResult> {
    if (isPlatformBrowser(this.platformId)) {
      const componentRef = createComponent(component, {
        environmentInjector: this.injector,
      });
      this.modalRef = createComponent(EjdaModalComponent, {
        environmentInjector: this.injector,
        projectableNodes: [[componentRef.location.nativeElement]],
      });

      document.body.appendChild(this.modalRef.location.nativeElement);
      this.appRef.attachView(componentRef.hostView);
      this.appRef.attachView(this.modalRef.hostView);

      this.response$ = new Subject();
      return this.response$.asObservable();
    }
    return EMPTY;
  }

  closeModal(response?: EjdaModalResult): void {
    if (this.modalRef && isPlatformBrowser(this.platformId)) {
      this.modalRef?.location.nativeElement.remove();
      this.modalRef = undefined;

      if (response) this.response$?.next(response);
      this.response$?.complete();
      this.response$ = undefined;
    }
  }
}
