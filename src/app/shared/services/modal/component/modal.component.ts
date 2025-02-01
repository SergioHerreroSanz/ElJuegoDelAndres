import { Component } from '@angular/core';
import { EjdaModalService } from '../modal.service';

@Component({
  selector: 'ejda-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class EjdaModalComponent {
  constructor(private readonly modalService: EjdaModalService) {}

  closeModal() {
    this.modalService.closeModal();
  }
}
