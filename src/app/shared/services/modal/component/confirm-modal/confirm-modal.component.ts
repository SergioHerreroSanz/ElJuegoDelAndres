import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { EjdaModalService } from '../../modal.service';
import { EjdaModalResult } from '../../models/modals.model';

@Component({
  selector: 'ejda-confirm-modal',
  imports: [TranslocoPipe],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
})
export class EjdaConfirmModalComponent {
  readonly modalResults = EjdaModalResult;

  constructor(private readonly modalService: EjdaModalService) {}

  closeModal(res: EjdaModalResult) {
    this.modalService.closeModal(res);
  }
}
