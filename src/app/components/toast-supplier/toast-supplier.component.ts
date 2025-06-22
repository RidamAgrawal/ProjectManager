import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { NgbModal, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { throttleTime } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-toast-supplier',
  imports: [NgbToastModule, CommonModule,TranslateModule],
  templateUrl: './toast-supplier.component.html',
  styleUrl: './toast-supplier.component.css'
})
export class ToastSupplierComponent {
  @ViewChild('content', { static: true }) modal!: TemplateRef<any>;
  showLoginSuccess = '';
  showWrongCredentials = false;
  showUnknownError = false;
  showServerError = false;
  showNetworkError = false;
  showNotFoundError = false;
  showProjectAdded = '';
  showProjectDeleted = '';
  showProjectUpdated = '';
  showTaskAdded = '';
  showTaskDeleted = '';
  showTaskUpdated = '';
  showModal = '';
  constructor(private toastService: ToastService) {

    this.toastService.loginSuccess
      .subscribe({
        next: (userName) => {
          this.showLoginSuccess = userName;
        }
      })

    this.toastService.wrongCredentials
      .subscribe({
        next: () => {
          this.showWrongCredentials = true;
        }
      })

    this.toastService.unknownError
      .subscribe({
        next: () => {
          this.showUnknownError = true;
        }
      })
    this.toastService.serverError
      .subscribe({
        next: () => {
          this.showServerError = true;
        }
      })
    this.toastService.networkError
      .subscribe({
        next: () => {
          this.showNetworkError = true;
        }
      })
    this.toastService.notFoundError
      .subscribe({
        next: () => {
          this.showNotFoundError = true;
        }
      })

    this.toastService.projectAdded
      .subscribe({
        next: (projectName) => {
          this.showProjectAdded = projectName;
        }
      })
    this.toastService.projectDeleted
      .subscribe({
        next: (projectName) => {
          this.showProjectDeleted = projectName;
        }
      })

    this.toastService.projectUpdated
      .subscribe({
        next: (projectName) => {
          this.showProjectUpdated = projectName;
        }
      })

    this.toastService.taskAdded
      .subscribe({
        next: (taskName) => {
          this.showTaskAdded = taskName;
        }
      })
    this.toastService.taskDeleted
      .subscribe({
        next: (taskName) => {
          this.showTaskDeleted = taskName;
        }
      })

    this.toastService.taskUpdated
      .subscribe({
        next: (taskName) => {
          this.showTaskUpdated = taskName;
        }
      })
  }
}
