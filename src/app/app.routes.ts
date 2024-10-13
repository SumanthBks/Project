import { Routes } from '@angular/router';
import { LoginFormComponent } from '../login-form/login-form.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';

export const routes: Routes = [
    { path: 'login', component: LoginFormComponent },
    { path: 'userProfile', component: UserProfileComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' },
];
