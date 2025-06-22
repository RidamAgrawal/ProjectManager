import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbDate, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';
import { Observable, switchMap, map } from 'rxjs';
import { PRIORITY, Task, TaskBasicDetails, TaskCreate, TASKSTATUS } from '../../interfaces/task';
import { DetailsService } from '../../services/details.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../interfaces/user';
import { minDateValidator } from '../../directives/min-date.directive';
import { isEqual } from 'lodash';
import { TranslateModule } from '@ngx-translate/core';

interface TaskFormGroup {
  title: FormControl<string>,
  assignee: FormControl<string>,
  status: FormControl<keyof typeof TASKSTATUS>,
  priority: FormControl<keyof typeof PRIORITY>,
  dueDate: FormControl<NgbDate>,
}

@Component({
  selector: 'app-modal',
  imports: [NgbDatepickerModule, AsyncPipe, JsonPipe, ReactiveFormsModule,TranslateModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @ViewChild('modal', { static: true }) modal: TemplateRef<any> | undefined;
  @ViewChild('addTaskModal', { static: true }) taskModal: TemplateRef<any> | undefined;
  public title: string = '';
  private fetchedTask!: TaskBasicDetails;
  public task$!: Observable<Task>;
  public users$: Observable<User[]>;
  public taskForm: FormGroup<TaskFormGroup>;
  public priorityEntries = Object.entries(PRIORITY);
  public taskStatusEntries = Object.entries(TASKSTATUS);
  public todayNgbDate: NgbDate;
  constructor(private modalService: NgbModal, private toastService: ToastService, private detailsService: DetailsService, private nnfb: NonNullableFormBuilder) {
    const todayDate = new Date();
    this.todayNgbDate = new NgbDate(todayDate.getFullYear(), todayDate.getMonth() + 1, todayDate.getDate());

    this.users$ = this.detailsService.getAllUsers();

    this.taskForm = this.nnfb.group<TaskFormGroup>({
      title: this.nnfb.control('', {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      assignee: this.nnfb.control('', {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      status: this.nnfb.control<keyof typeof TASKSTATUS>("pending", {
        validators: [Validators.required]
      }),
      priority: this.nnfb.control<keyof typeof PRIORITY>('low', {
        validators: [Validators.required]
      }),
      dueDate: this.nnfb.control<NgbDate>(this.todayNgbDate, {
        validators: [Validators.required, minDateValidator(this.todayNgbDate)]
      })
    })
  }
  ngAfterViewInit() {
    this.toastService.showModal
      .subscribe((title) => {
        this.title = title;
        this.modalService.open(this.modal)
          .result
          .then(
            (resolve) => { this.toastService.modalResponse.next(title); }
          )
      })

    this.toastService.taskModal
      .subscribe(taskId => {
        if (taskId) {
          this.detailsService.getTaskById(taskId)
            .subscribe({
              next: (task) => {
                const { title, assignee, status, priority, dueDate } = task
                this.fetchedTask = { title, assignee: assignee._id, status, priority, dueDate };
                this.title = title;
                this.taskForm.patchValue({ title, assignee: assignee._id, status, priority, dueDate });
                this.modalService.open(this.taskModal, { size: 'lg' }).result
                  .then(responseOk => {
                    //sending back the form values includes taskId
                    this.toastService.taskModalResponse.next({ taskId: task._id, ...this.taskForm.value as TaskCreate })
                  }
                  )
              },
              error: (error) => {
                this.showErrorToast(error.status);
              }
            })
        }
        else {
          this.modalService.open(this.taskModal, { size: 'lg' }).result
            .then(responseOk => {
              //sending back the form values not includes taskId
              this.toastService.taskModalResponse.next(this.taskForm.value as TaskCreate)
            }
            )
        }
        this.taskForm.reset();
        this.title = '';
      })
  }

  isValid() {
    if (!this.title) { return !this.taskForm.valid; }
    return !isEqual(this.taskForm.value, this.fetchedTask) && this.taskForm.valid;
  }

  showErrorToast(errorStatus:number) {
    switch (errorStatus) {
      case 0:
        this.toastService.networkError.next();
        break;
      case 404:
        this.toastService.notFoundError.next();
        break;
      case 500:
        this.toastService.serverError.next();
        break;
      default:
        this.toastService.unknownError.next();
    }
  }
}
