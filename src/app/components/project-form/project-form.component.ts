import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DetailsService } from '../../services/details.service';
import { NgbDate, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { Project, ProjectBasicDetails, ProjectDetails } from '../../interfaces/project';
import { ToastService } from '../../services/toast.service';
import { Title } from '@angular/platform-browser';
import { switchMap, map, Observable } from 'rxjs';
import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';
import { minDateValidator } from '../../directives/min-date.directive';
import { isEqual } from 'lodash';
import { endDateValidator } from '../../directives/end-date-valid.directive';
import { TranslateModule } from '@ngx-translate/core';


interface ProjectFormDetails {
  name: FormControl<string>,
  description: FormControl<string>,
  startDate: FormControl<NgbDate>,
  endDate: FormControl<NgbDate>,
}

@Component({
  selector: 'app-project-form',
  imports: [CommonModule,ReactiveFormsModule, NgbDatepickerModule, RouterModule, AsyncPipe, JsonPipe,TranslateModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectFormComponent {
  projectForm!: FormGroup<ProjectFormDetails>;
  projectId: string | null = null;
  fetchedProject!:ProjectBasicDetails;
  todayNgbDate:NgbDate;
  constructor(
    private nnfb: NonNullableFormBuilder,
    private activatedRoute: ActivatedRoute,
    private detailsService: DetailsService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private titleService: Title
  ) {

    const paramIdObj = this.activatedRoute.snapshot.params;
    if (paramIdObj.hasOwnProperty('id')) {
      this.projectId = paramIdObj['id'];
    }

    const todayDate = new Date();
    this.todayNgbDate= new NgbDate(todayDate.getFullYear(), todayDate.getMonth() + 1, todayDate.getDate());
    this.projectForm = this.nnfb.group<ProjectFormDetails>({
      name: this.nnfb.control('', {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      description: this.nnfb.control(''),
      startDate: this.nnfb.control<NgbDate>(this.todayNgbDate, {
        validators: [Validators.required,minDateValidator(this.todayNgbDate)]
      }),
      endDate: this.nnfb.control<NgbDate>(this.todayNgbDate, {
        validators: [Validators.required,minDateValidator(this.todayNgbDate)]
      }),
    },{validators:[endDateValidator()]})
  }

  ngOnInit() {
    if (this.projectId) {
      this.detailsService.getProjectById(this.projectId)
        .subscribe({
          next: (project) => {
            const {name,description,startDate,endDate}=project;
            this.fetchedProject={name,description,startDate,endDate};
            this.titleService.setTitle(`App|${project.name}`);
            this.projectForm.patchValue(project);
          },
          error: (error) => {
            console.log(error);
          }
        })
    }
  }

  get name(){
    return this.projectForm.get('name') as FormControl;
  }

  get description(){
    return this.projectForm.get('description') as FormControl;
  }

  get startDate(){
    return this.projectForm.get('startDate') as FormControl;
  }

  get endDate(){
    return this.projectForm.get('endDate') as FormControl;
  }
  isValid() {
    return !isEqual(this.projectForm.value as ProjectBasicDetails,this.fetchedProject)&&this.projectForm.valid;
  }

  handleSubmit() {
    const projectFormDetails = this.projectForm.value as ProjectDetails;

    if (this.projectId) {
      this.detailsService.updateProjectById({...projectFormDetails,id:this.projectId})
        .subscribe({
          next: (data) => {
            console.log(data);
            this.toastService.projectUpdated.next(projectFormDetails.name);
          },
          error: (error) => {
            console.log(error);
            this.toastService.unknownError.next();
          }
        })
      this.router.navigate(['projects']);
      return;
    }


    this.authService.userId
      .pipe(
        switchMap(id =>
          this.detailsService.createProject({...projectFormDetails,id})
        )
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.toastService.projectAdded.next(projectFormDetails.name);
        },
        error: (error) => {
          console.log(error);
          switch (error.status) {
            case 0:
              this.toastService.unknownError.next();
              break;
            default:
              this.toastService.unknownError.next();
          }
        }
      })
    this.router.navigate(['..', 'projects']);
  }

}
