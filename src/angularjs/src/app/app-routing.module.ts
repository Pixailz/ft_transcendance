import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeDashboardComponent } from './pages/home-dashboard/home-dashboard.component';
import { PongComponent } from './pages/pong/pong.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuardService } from './services/auth-guard.service';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
	{
		path: 'home',
		component: HomeDashboardComponent,
	},
	{
		path: 'play',
		component: PongComponent,
		canActivate: [authGuardService],
	},
	{
		path: 'profile',
		component: UserProfileComponent,
		canActivate: [authGuardService],
	},
	{
		path: 'login',
		component: LoginComponent,
	},
	{
		path: 'register',
		component: RegisterComponent,
		canActivate: [authGuardService],
	},
	{
		path: '**',
		component: PageNotFoundComponent,
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
