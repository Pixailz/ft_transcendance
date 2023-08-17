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
import { AnonymousLayoutComponent } from './layout/anonymous-layout.component';
import { AuthenticatedLayoutComponent } from './layout/authenticated-layout.component';

const routes: Routes = [
	{
		path: '',
		component: AuthenticatedLayoutComponent,
		canActivate: [ AuthGuardService ],
		children: [
			{
				path: '',
				component: HomeDashboardComponent,
			},
			{
				path: 'home',
				component: HomeDashboardComponent,
			},
			{
				path: 'play',
				component: PongComponent,
			},
			{
				path: 'profile',
				component: UserProfileComponent,
			},
			{
				path: 'chat',
				component: WSChatComponent,
			}
		]
	},
	{
		path: '',
		component: AnonymousLayoutComponent,
		children: [
			{
				path: 'login',
				component: LoginComponent
			},
			{
				path: 'register',
				component: RegisterComponent,
				canActivate: [AuthGuardService]
			}
		]
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
