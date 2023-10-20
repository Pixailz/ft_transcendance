import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeDashboardComponent } from './pages/home-dashboard/home-dashboard.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { RegisterComponent } from './pages/register/register.component';
import { AnonymousLayoutComponent } from './layout/anonymous-layout.component';
import { AuthenticatedLayoutComponent } from './layout/authenticated-layout.component';
import { ProfileComponent } from './pages/profile/profile.component';

import { GameComponent } from './pages/game/game.component';
import { PrivChatPageComponent } from './pages/priv-chat-page/priv-chat-page.component';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { AchievementsComponent } from './pages/achievements/achievements.component';

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
				component: GameComponent,
				data: { animation: 'Play', reuseRoute: true }
			},{
				path: 'play/:room_id',
				component: GameComponent,
				data: { animation: 'Play', reuseRoute: false }
			},
			{
				path: 'chat/dm',
				component: PrivChatPageComponent,
				data: { animation: 'ChatDm', reuseRoute: true }
			},
			{
				path: 'chat/global',
				component: ChatPageComponent,
				data: { animation: 'ChatChannel', reuseRoute: true }
			},
			{
				path: 'profile/:nickname',
				component: ProfileComponent,
				data: { animation: 'ProfileUser', reuseRoute: true }
			},
			{
				path: 'achievements/:nickname',
				component: AchievementsComponent,
				data: { animation: 'Achievements', reuseRoute: true }
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
			},
			{
				path: 'register',
				canActivate: [ AuthGuardService ],
				component: RegisterComponent,
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
