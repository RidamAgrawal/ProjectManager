import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule,MatSelectModule, MatFormFieldModule, MatIconModule, FormsModule,TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @ViewChild('userDetails') userDetailsTab!: ElementRef;
  public showDropDown: boolean = false;
  public isAuthentic$: BehaviorSubject<boolean>;
  public userName$: BehaviorSubject<string>;
  public selectedLanguage='';
  constructor(private authService: AuthService,private toastService:ToastService,private router:Router,private translate:TranslateService) {
    this.isAuthentic$ = this.authService.isAuthentic;
    this.userName$ = this.authService.userName;
    translate.setDefaultLang('en');
    translate.use('en');
  }
  ngAfterViewInit() {
    fromEvent(document, 'click')
      .subscribe((event) => {
        const userDetailsTabElement = this.userDetailsTab.nativeElement as HTMLElement;
        if (userDetailsTabElement.contains(event.target as HTMLElement)) {
          this.showDropDown = true;
        }
        else if (this.showDropDown) { this.showDropDown = false; }
      })
  }
  handleLogout(){
    this.toastService.showModal.next('logout');
    this.toastService.modalResponse.subscribe(responseOk=>{
      if(responseOk==='logout'){
        localStorage.removeItem('token');
        this.authService.isAuthentic.next(false);
        this.router.navigate(['']);
      }
    })
  }
  switchLanguage(){
    this.translate.use(this.selectedLanguage);
  }
}
