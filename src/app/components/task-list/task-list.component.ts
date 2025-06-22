import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Task, TASKSTATUS, PRIORITY, TaskCreate, TaskUpdate } from '../../interfaces/task';
import { config, first, Observable } from 'rxjs';
import { DetailsService } from '../../services/details.service';
import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import * as $ from 'jquery';
import { DataTableDirective, DataTablesModule } from "angular-datatables";
import { Config } from 'datatables.net-dt';
import { ToastService } from '../../services/toast.service';
import { NgbDatePipe } from '../../pipes/ngb-date.pipe';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TaskCountPipe } from '../../pipes/task-count.pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-task-list',
  imports: [AsyncPipe, JsonPipe,TaskCountPipe, DataTablesModule, NgbDatePipe, MatSelectModule, MatFormFieldModule, MatIconModule, FormsModule,TranslateModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export default class TaskListComponent {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  public taskStatus = TASKSTATUS;
  public taskStatusEntries = Object.entries(TASKSTATUS);
  public priority = PRIORITY;
  public priorityEntries=Object.entries(PRIORITY);
  public projectId!: string;
  public selectedStatus='';
  public selectedPriority='';
  public tasks$!: Observable<Task[]>;
  public dtOptions: Config = {};
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private detailsService: DetailsService,
    private toastService: ToastService
  ) { }
  ngOnInit() {
    this.projectId = this.router.routerState.snapshot.url.split('/')[2];
    this.getTasks();
    this.dtOptions = {
      language: {
        info: 'Showing _START_ to _END_ of _TOTAL_ tasks',
        infoEmpty: 'No tasks available',
        infoFiltered: '(filtered from _MAX_ total records)',
        lengthMenu: 'Display _MENU_ records per page',
        zeroRecords: 'no task found',
        loadingRecords: 'loading ...',
        paginate: {
          first: 'First',
          last: 'Last'
        },
      },
      layout:{
        topEnd:null,
        topStart:null,
        bottomEnd:'paging',
        bottomStart:'pageLength'
      },
      pageLength: 10,
      columnDefs:[
        {orderable:false,targets:[0,3,4,5,6]}
      ]
    }
  }
  getTasks() {
    this.tasks$ = this.detailsService.getAllTaskWithProjectId(this.projectId);
  }
  handleEdit(id: string) {
    this.toastService.taskModal.next(id);
    this.toastService.taskModalResponse
      .pipe(first())
      .subscribe((task) => {
        this.detailsService.updateTaskById({ ...task as TaskUpdate })
          .subscribe({
            next: (updatedTask) => {
              this.toastService.projectUpdated.next(task.title);
              this.getTasks();
            },
            error: (error) => {
              this.showErrorToast(error.status);
            }
          })
      });
  }
  handleAdd() {
    this.toastService.taskModal.next('');
    this.toastService.taskModalResponse
      .pipe(first())
      .subscribe((task) => {
        this.detailsService.createTask({ ...task, project: this.projectId })
          .subscribe({
            next: (createdTask) => {
              this.toastService.taskAdded.next(task.title);
              this.getTasks();
              this.cdr.detectChanges();
            },
            error: (error) => {
              this.showErrorToast(error.status);
            }
          })
      });
  }
  handleDelete(title: string, id: string) {
    this.toastService.showModal.next(`Delete Task: ${title}`);
    this.toastService.modalResponse
      .subscribe(responseOk => {
        if (responseOk === `Delete Task: ${title}`) {
          this.detailsService.deleteTaskWithId(id)
            .subscribe({
              next: (deletedTask) => {
                this.toastService.projectDeleted.next(`Deleted ${title}`);
                this.getTasks();
                this.cdr.detectChanges();
              },
              error: (error) => {
                this.showErrorToast(error.status);
              }
            })
        }
      });
  }

  showErrorToast(errorStatus: number) {
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
  filterStatus() {
    this.dtElement.dtInstance.then(dtInstance => {
      if (this.selectedStatus) {
        dtInstance.column(3).search('^' + this.selectedStatus + '$', true, false).draw();
      } else {
        dtInstance.column(3).search('').draw();
      }
    });
  }
  filterPriority() {
    this.dtElement.dtInstance.then(dtInstance => {
      if (this.selectedPriority) {
        dtInstance.column(4).search('^' + this.selectedPriority + '$', true, false).draw();
      } else {
        dtInstance.column(4).search('').draw();
      }
    });
  }
}
