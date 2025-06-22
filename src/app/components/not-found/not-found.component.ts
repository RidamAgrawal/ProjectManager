import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  imports: [RouterModule,AsyncPipe,TranslateModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  userValid:BehaviorSubject<boolean>;
  constructor(private authService:AuthService,private router:Router){
    this.userValid=this.authService.isAuthentic;
  }
  navigateToLogin(){
    this.router.navigate(['']);
  }
  navigateToDashboard(){
    this.router.navigate(['dashboard']);
  }
}
