import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeDashboardComponent } from './pages/home-dashboard/home-dashboard.component';
import { PongComponent } from './pages/pong/pong.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { RegisterComponent } from './pages/register/register.component';
import { WSChatComponent } from './pages/chat/chat.component';

const routes: Routes = [
	{
		path: 'home',
		component: HomeDashboardComponent,
	},
	{
		path: 'play',
		component: PongComponent,
		canActivate: [AuthGuardService],
	},
	{
		path: 'profile',
		component: UserProfileComponent,
		canActivate: [AuthGuardService],
	},
	{
		path: 'chat',
		component: WSChatComponent,
		canActivate: [AuthGuardService],
	},
	{
		path: 'login',
		component: LoginComponent,
	},
	{
		path: 'register',
		component: RegisterComponent,
		canActivate: [AuthGuardService],
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
