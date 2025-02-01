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
import { EjdaModalComponent } from './component/modal.component';

@Injectable({
  providedIn: 'root',
})
export class EjdaModalService {
  private modalRef?: ComponentRef<any>;

  constructor(
    protected readonly appRef: ApplicationRef,
    protected readonly injector: EnvironmentInjector,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  openModal(component: Type<unknown>) {
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
    }
  }

  closeModal(): void {
    if (this.modalRef && isPlatformBrowser(this.platformId)) {
      this.modalRef?.location.nativeElement.remove();
      this.modalRef = undefined;
    }
  }
}
