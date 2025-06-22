import { Component, HostListener, TemplateRef, ViewChild } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import $ from 'jquery';
import "datatables.net";
import { HeaderComponent } from './components/header/header.component';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from './services/toast.service';
import { ToastSupplierComponent } from './components/toast-supplier/toast-supplier.component';
import { NgbModalModule,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './components/modal/modal.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule,HeaderComponent,NgbToastModule,ToastSupplierComponent,ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'App';
}
