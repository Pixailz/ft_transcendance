import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeDashboardComponent } from './pages/home-dashboard/home-dashboard.component';
import { PongComponent } from './pages/pong/pong.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuardService, RegisterGuardService } from './services/auth-guard.service';
import { RegisterComponent } from './pages/register/register.component';
import { AnonymousLayoutComponent } from './layout/anonymous-layout.component';
import { AuthenticatedLayoutComponent } from './layout/authenticated-layout.component';
import { ProfileComponent } from './pages/profile/profile.component';

import { WSChatDmComponent } from './pages/chat-dm/chat-dm.component';
import { WSChatChannelComponent } from './pages/chat-channel/chat-channel.component';

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
				data: { animation: 'Home', reuseRoute: true }
			},
			{
				path: 'play',
				component: PongComponent,
				data: { animation: 'Play', reuseRoute: true }
			},
			{
				path: 'chat/dm',
				component: WSChatDmComponent,
				data: { animation: 'ChatDm', reuseRoute: true }
			},
			{
				path: 'chat/global',
				component: WSChatChannelComponent,
				data: { animation: 'ChatChannel', reuseRoute: true }
			},
			{
				path: 'profile',
				component: UserProfileComponent,
				data: { animation: 'Profile', reuseRoute: true }
			},
			{
				path: 'profile/:login',
				component: ProfileComponent,
				data: { animation: 'ProfileUser', reuseRoute: true }
			},
			{
				// throw a 404 error if the route is not found
				matcher: (url) => {
					// matches every route except login and register, which are handled by the anonymous layout
					// by doing this, 404 is exclusive to authenticated layout and logged out user is redirected
					if (url.length === 1 && !(url[0].path === 'login' || url[0].path === 'register'))
						return ({ consumed: url });
					return ({ consumed: [] });
				},
				component: PageNotFoundComponent,
				data: { animation: 'PageNotFound' }
			}
		]
	},
	{
		path: '',
		component: AnonymousLayoutComponent,
		children: [
			{
				path: 'login',
				component: LoginComponent,
				canActivate: [RegisterGuardService]
			},
			{
				path: 'register',
				component: RegisterComponent,
				canActivate: [AuthGuardService, RegisterGuardService]
			}
		]
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
