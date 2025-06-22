import { NgbDate } from "@ng-bootstrap/ng-bootstrap";

export interface Task{
    _id:string,
    title:string,
    assignee:{_id:string,name:string},
    status:keyof typeof TASKSTATUS,
    priority:keyof typeof PRIORITY,
    dueDate:NgbDate,
    project:string,
    createdAt:Date,
    updatedAt:Date,
}
export interface TaskBasicDetails{
    title:string,
    assignee:string,
    status:keyof typeof TASKSTATUS,
    priority:keyof typeof PRIORITY,
    dueDate:NgbDate,
}
export interface TaskCreate{
    project:string,
    title:string,
    assignee:string,
    status:keyof typeof TASKSTATUS,
    priority:keyof typeof PRIORITY,
    dueDate:NgbDate,
}
export interface TaskUpdate{
    taskId:string,
    title:string,
    assignee:string,
    status:keyof typeof TASKSTATUS,
    priority:keyof typeof PRIORITY,
    dueDate:NgbDate,
}
export enum TASKSTATUS{
    pending="Pending",
    progress="In Progress",
    completed="Completed",
}
export enum PRIORITY{
    low="Low",
    mild="Mild",
    medium="Medium",
    high="High",
    vhigh="Very High",
    urgent="Urgent"
}