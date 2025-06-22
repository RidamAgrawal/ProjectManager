import { NgbDate } from "@ng-bootstrap/ng-bootstrap";

export interface Project {
    _id: string,
    name: string,
    description: string,
    status: number,
    user: {
        _id: string,
        email: string,
    },
    task: [],
    startDate: NgbDate,
    endDate: NgbDate,
    createdAt: Date,
    updatedAt: Date,
}

export interface ProjectDetails {
    id: string,
    name: string,
    description: string,
    startDate: NgbDate,
    endDate: NgbDate,
}
export interface ProjectBasicDetails {
    name: string,
    description: string,
    startDate: NgbDate,
    endDate: NgbDate,
}

export enum STATUS {
    "open",
    "in-progress",
    "done",
}