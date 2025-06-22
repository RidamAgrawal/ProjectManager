import { CommonModule, JsonPipe } from '@angular/common';
import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { DetailsService } from '../../services/details.service';
import { userLoginDetails, userRegisterDetails } from './user-form.model';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface LoginForm{
  email:FormControl<string>,
  password:FormControl<string>,
}

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, RouterModule,CommonModule,TranslateModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent {
  public userForm!: FormGroup<LoginForm>;

  constructor(
    private nnfb: NonNullableFormBuilder,
    private detailsService: DetailsService,
    private router:Router,
    private toastService:ToastService,
    private authService:AuthService,
    private translate:TranslateService
  ) {
    this.userForm = this.nnfb.group({
      email: this.nnfb.control('', {
        validators: [Validators.required, Validators.minLength(12), Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]
      }),
      password: this.nnfb.control('', {
        validators: [Validators.required, Validators.minLength(8)]
      })
    });
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  get email(){
    return this.userForm.get('email') as FormControl;
  }

  get password(){
    return this.userForm.get('password') as FormControl;
  }
  handleSubmit() {
    try{
      this.detailsService.login(this.userForm.value as userLoginDetails)
      .subscribe({
        next:(data)=>{
          localStorage.setItem('token',JSON.stringify({name:data.name,id:data.id,expiry:Date.now()+(1000*60*5)}));

          this.authService.isAuthentic.next(true);

          this.authService.userName.next(data.name);
          
          this.authService.userId.next(data.id);

          this.userForm.reset();
          
          this.toastService.loginSuccess.next(data.name);
          
          this.router.navigate(['dashboard']);
        },
        error:(error)=>{
          switch(error.status){
            case 401:
              this.toastService.wrongCredentials.next();
              break;
            default:
              this.toastService.unknownError.next();
          }
        }
      })
    }
    catch(error){
      this.toastService.unknownError.next();
    }
  }
}
