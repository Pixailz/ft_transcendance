import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeDashboardComponent } from './pages/home-dashboard/home-dashboard.component';
import { PongComponent } from './pages/pong/pong.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { RegisterComponent } from './pages/register/register.component';
import { WSPrivChatComponent } from './pages/priv-chat/priv-chat.component';
import { AnonymousLayoutComponent } from './layout/anonymous-layout.component';
import { AuthenticatedLayoutComponent } from './layout/authenticated-layout.component';
import { TwofaformComponent } from './components/twofaform/twofaform.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
	{
		path: '',
		component: AuthenticatedLayoutComponent,
		canActivate: [ AuthGuardService ],
		runGuardsAndResolvers: 'always',
		children: [
			{
				path: '',
				redirectTo: '/home',
				pathMatch: 'full'
			},
			{
				path: 'home',
				component: HomeDashboardComponent,
				data: { animation: 'Home' }
			},
			{
				path: 'play',
				component: PongComponent,
				data: { animation: 'Play' }
			},
			{
				path: 'profile',
				component: UserProfileComponent,
				data: { animation: 'Profile' }
			},
			{
				path: 'profile/:login',
				component: ProfileComponent,
				data: { animation: 'ProfileUser' }
			},
			{
				path: 'chat/private',
				component: WSPrivChatComponent,
				data: { animation: 'PrivChat' }
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
