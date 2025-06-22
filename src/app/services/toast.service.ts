import { Injectable, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { Task, TaskCreate, TaskUpdate } from '../interfaces/task';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  wrongCredentials=new Subject<void>();
  loginSuccess=new Subject<string>();
  unknownError=new Subject<void>();
  networkError=new Subject<void>();
  serverError=new Subject<void>();
  notFoundError=new Subject<void>();
  projectAdded=new Subject<string>();
  projectDeleted=new Subject<string>();
  projectUpdated=new Subject<string>();
  taskAdded=new Subject<string>();
  taskDeleted=new Subject<string>();
  taskUpdated=new Subject<string>();
  showModal=new Subject<string>();
  taskModal=new Subject<string>();  // taskModal used only for edit task and add task so string will be task id
  modalResponse=new Subject<string>();
  taskModalResponse=new Subject<TaskCreate|TaskUpdate>();
}
