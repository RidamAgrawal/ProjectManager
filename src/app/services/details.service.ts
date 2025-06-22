import { Injectable } from '@angular/core';
import { ajax } from 'rxjs/ajax';
import { Project,ProjectDetails } from '../interfaces/project';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { userLoginDetails, userRegisterDetails } from '../components/user-form/user-form.model';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { PRIORITY, Task, TaskCreate, TASKSTATUS, TaskUpdate } from '../interfaces/task';
import { User } from '../interfaces/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {
  private hostUrl= environment.HOST_URL;
  constructor(private http: HttpClient) { }
  public login(userDetails: userLoginDetails): Observable<any> {
    return this.http.post<any>(this.hostUrl+'/users/login', {
      ...userDetails
    });
  }
  public register(userDetails: userRegisterDetails): Observable<any> {
    return this.http.post<any>(this.hostUrl+'/users/register', {
      ...userDetails
    })
  }
  public getAllUsers(){
    return this.http.get<User[]>(this.hostUrl+'/users');
  }
  public getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.hostUrl+'/projects');
  }
  public getAllProjectsWithUserId(id: string): Observable<Project[]> {
    return this.http.get<Project[]>(this.hostUrl+`/projects/user/${id}`);
  }
  public getProjectById(id: string) {
    return this.http.get<Project>(this.hostUrl+`/projects/${id}`);
  }
  public updateProjectById({id ,name, description, startDate, endDate}:ProjectDetails) {
    return this.http.put<Project>(this.hostUrl+`/projects/${id}`, {
      name, description, startDate, endDate
    })
  }
  public deleteProjectById(id:string){
    return this.http.delete<Project>(this.hostUrl+`/projects/${id}`);
  }
  public createProject({id, name, description, startDate, endDate}:ProjectDetails) {
    return this.http.post<Project>(this.hostUrl+`/projects/`, {
      name, description, startDate, endDate, user:id
    })
  }
  public getAllTaskWithProjectId(projectId:string){
    return this.http.get<Task[]>(this.hostUrl+`/tasks/project/${projectId}`);
  }
  public createTask({project,title,assignee,status,priority,dueDate}:TaskCreate){
    return this.http.post<Task>(this.hostUrl+`/tasks`, {
      title, assignee, status, priority, dueDate, project
    })
  }
  public updateTaskById({taskId,title,assignee,status,priority,dueDate}:TaskUpdate){
    return this.http.put<Task>(this.hostUrl+`/tasks/${taskId}`, {
      name, title, assignee, status, priority, dueDate,
    })
  }
  public getTaskById(taskId:string){
    return this.http.get<Task>(this.hostUrl+`/tasks/${taskId}`);
  }
  public deleteTaskWithId(taskId:string){
    return this.http.delete<Task>(this.hostUrl+`/tasks/${taskId}`);
  }
}
