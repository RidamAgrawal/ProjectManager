import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/user-form/user-form.component')
            .then(m => m.UserFormComponent),
        title: 'App|Login', 
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component')
            .then(m => m.DashboardComponent),
        title: 'App|Dashboard',
        canActivate: [AuthGuard],
    },
    // {
    //     path: 'login',
    //     loadComponent: () => import('./components/user-form/user-form.component')
    //         .then(m => m.UserFormComponent),
    //     title: 'App|Login',
    // },
    {
        path: 'register',
        loadComponent: () => import('./components/user-form/user-form.component')
            .then(m => m.UserFormComponent),
        title: 'App|Register',
    },
    {
        path: 'projects',
        loadComponent: () => import('./components/projects/projects.component')
            .then(m => m.ProjectsComponent),
        title: 'App|Project Router',
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./components/project-list/project-list.component')
                    .then(m => m.ProjectListComponent),
                title: 'App|Projects',
                canActivate: [AuthGuard],
            },
            {
                path: 'new',
                loadComponent: () => import('./components/project-form/project-form.component')
                    .then(m => m.ProjectFormComponent),
                title: 'App|CreateNewProject',
                canActivate: [AuthGuard],
            },
            {
                path: ':id',
                loadComponent: () => import('./components/project-edit/project-edit.component')
                    .then(m => m.ProjectEditComponent),
                canActivate: [AuthGuard],
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./components/project-form/project-form.component')
                            .then(m => m.ProjectFormComponent),
                        canActivate: [AuthGuard],
                    },
                    {
                        path: 'tasks',
                        loadComponent: () => import('./components/task-list/task-list.component')
                            .then(m => m.default),
                        title: 'App|Tasks',
                        canActivate: [AuthGuard],
                    },
                ]
            },
        ]
    },
    {
        path: '**',
        loadComponent: () => import('./components/not-found/not-found.component')
            .then(m => m.NotFoundComponent),
        title: 'App|Projects',
    }
];
