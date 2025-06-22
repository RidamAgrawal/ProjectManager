import { ChangeDetectionStrategy, Component, effect, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Project, STATUS } from '../../interfaces/project';
import { DetailsService } from '../../services/details.service';
import { AsyncPipe, CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ProjectCountPipe } from '../../pipes/project-count.pipe';
import { RouterModule } from '@angular/router';
import { Observable, switchMap, map, filter, Subject } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import $ from 'jquery';
import { DataTableDirective, DataTablesModule } from "angular-datatables";
import { Config } from 'datatables.net-dt';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-projects',
  imports: [DatePipe, CommonModule, ProjectCountPipe, RouterModule, AsyncPipe, DataTablesModule, MatSelectModule, MatFormFieldModule, MatIconModule, FormsModule,TranslateModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  public status = STATUS;
  public projects$!: Observable<Project[]>;
  public dtOptions: Config = {};
  public selectedStatus: string = '';
  constructor(
    private authService: AuthService,
    private detailsService: DetailsService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getProjects();
    this.dtOptions = {
      language: {
        info: 'Showing _START_ to _END_ of _TOTAL_ projects',
        infoEmpty: 'No projects available',
        infoFiltered: '(filtered from _MAX_ total records)',
        lengthMenu: 'Display _MENU_ projects per page',
        zeroRecords: 'no project found',
        loadingRecords: 'loading ...',
        paginate: {
          first: 'First',
          last: 'Last'
        },
      },
      layout: {
        topEnd: null,
        topStart: null,
        bottomEnd: 'paging',
        bottomStart: 'pageLength'
      },
      columnDefs: [
        { orderable: false, targets: [0, 2, 4, 5] }
      ],
      pageLength: 10,
    }
  }

  handleDelete(projectId: string, projectName: string) {
    this.toastService.showModal.next(`delete ${projectName}`);
    const modalResponseSubscription = this.toastService.modalResponse
      .subscribe(responseOk => {
        if (responseOk === `delete ${projectName}`) {
          this.detailsService.deleteProjectById(projectId)
            .subscribe({
              next: (deletedProject) => {
                this.toastService.projectDeleted.next(projectName);
                this.getProjects();
                this.cdr.detectChanges()
              },
              error: (error) => {
                this.showToastError(error.status);
              }
            })
        }
      })

  }

  getProjects() {
    this.projects$ = this.authService.userId
      .pipe(
        switchMap((id) => this.detailsService.getAllProjectsWithUserId(id))
      )
  }

  showToastError(errorStatus: number) {
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
  filterTable() {
    this.dtElement.dtInstance.then(dtInstance => {
      if (this.selectedStatus) {
        dtInstance.column(4).search('^' + this.selectedStatus + '$', true, false).draw();
      } else {
        dtInstance.column(4).search('').draw();
      }
    });
  }
}
