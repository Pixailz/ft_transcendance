import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { CodeInputModule } from 'angular-code-input';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuardService } from './services/auth-guard.service';
import { AnonymousLayoutComponent } from './layout/anonymous-layout.component';
import { AuthenticatedLayoutComponent } from './layout/authenticated-layout.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { ErrordialogComponent } from './components/errordialog/errordialog.component';
import { FlatButtonComponent } from './components/flat-button/flat-button.component';
import { FlatListComponent } from './components/flat-list/flat-list.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeDashboardComponent } from './pages/home-dashboard/home-dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { NotificationComponent } from './components/notification/notification.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { TwofaformComponent } from './components/twofaform/twofaform.component';
import { CustomReuseStrategy } from './reuse-strategy';
import {  MatBadgeModule  } from '@angular/material/badge';
import { ClipboardModule } from '@angular/cdk/clipboard';
// WEBSOCKET
import { GlobalErrorHandlerService } from './services/global-error-handler.service';
import { environment } from './environments/environment';
import { TextNotificationComponent } from './components/text-notification/text-notification.component';
import { NotifFriendReqReceivedComponent } from './components/notification/friend-req-received/friend-req-received.component';
import { NotifFriendReqSentComponent } from './components/notification/friend-req-sent/friend-req-sent.component';
import { NotifFriendReqAcceptedComponent } from './components/notification/friend-req-accepted/friend-req-accepted.component';
import { NotifFriendReqDeniedFromComponent } from './components/notification/friend-req-denied-from/friend-req-denied-from.component';
import { NotifFriendReqDeniedToComponent } from './components/notification/friend-req-denied-to/friend-req-denied-to.component';
import { ClickOutDirective } from './directives/click-out.directive';
import { ChatViewComponent } from './components/chat-view/chat-view.component';
import { PrivChatPageComponent } from './pages/priv-chat-page/priv-chat-page.component';
import { ResizableDirective } from './directives/resizable.directive';
import { ResizableHandleComponent } from './components/resizable-handle/resizable-handle.component';
import { NewDmComponent } from './components/new-dm/new-dm.component';
import { UserTooltipComponent } from './components/user-tooltip/user-tooltip.component';
import { TooltipDirective } from './directives/tooltip.directive';
import {MatTooltipModule} from '@angular/material/tooltip';

import { GameWaitingComponent } from './components/game/waiting/waiting.component';
import { GameStartedComponent } from './components/game/started/started.component';
import { GameComponent } from './pages/game/game.component';
import { GameLobbyComponent } from './components/game/lobby/lobby.component';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { NewChatRoomComponent } from './components/new-chat-room/new-chat-room.component';
import { ChatChannelFriendListComponent } from './components/chat-channel-friend-list/chat-channel-friend-list.component';
import { ChatRoomSettingsComponent } from './components/chat-room-settings/chat-room-settings.component';
import { JoinChatRoomComponent } from './components/join-chat-room/join-chat-room.component';
import { ProtectedRoomPasswordComponent } from './components/protected-room-password/protected-room-password.component';
import { GamesHistoryComponent } from './components/game/games-history/game-history.component';
import { NotifGameInviteComponent } from './components/notification/game-invite/game-invite.component';
import { GameInviteDialogComponent } from './components/game/invite-dialog/game-invite-dialog.component';
import { NotifAchievementComponent } from './components/notification/achievement/notif-achievement';
import { AchievementsComponent } from './pages/achievements/achievements.component';
import { MutedTimeComponentComponent } from './components/muted-time-component/muted-time-component.component';

import { ReplaceNickname } from 'src/utils/utils';

const config: SocketIoConfig = {
	url: environment.socket_url,
	options: {
		path: "/ws",
		extraHeaders: {
			Authorization: localStorage.getItem("access_token") as string
		},
		autoConnect: false,
	}
};

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		FooterComponent,
		HomeDashboardComponent,
		PageNotFoundComponent,
		UserProfileComponent,
		GamesHistoryComponent,
		AvatarComponent,
		LoginComponent,
		RegisterComponent,
		AnonymousLayoutComponent,
		AuthenticatedLayoutComponent,
		FlatButtonComponent,
		TwofaformComponent,
		ProfileComponent,
		ErrordialogComponent,
		FlatListComponent,
		NotificationComponent,
		TextNotificationComponent,
		NotifFriendReqSentComponent,
		NotifFriendReqReceivedComponent,
		NotifFriendReqAcceptedComponent,
		NotifFriendReqDeniedFromComponent,
		NotifFriendReqDeniedToComponent,
		NotifAchievementComponent,
		GameComponent,
		GameWaitingComponent,
		GameStartedComponent,
		GameLobbyComponent,
		ClickOutDirective,
		ChatViewComponent,
		PrivChatPageComponent,
		NotifGameInviteComponent,
		GameInviteDialogComponent,
		ResizableDirective,
		ResizableHandleComponent,
		NewDmComponent,
		UserTooltipComponent,
		TooltipDirective,
		ChatPageComponent,
		NewChatRoomComponent,
		ChatChannelFriendListComponent,
		ChatRoomSettingsComponent,
		JoinChatRoomComponent,
		ProtectedRoomPasswordComponent,
		AchievementsComponent,
		MutedTimeComponentComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		MatGridListModule,
		MatCardModule,
		MatMenuModule,
		MatIconModule,
		MatButtonModule,
		MatDialogModule,
		MatToolbarModule,
		MatTableModule,
		MatPaginatorModule,
		MatListModule,
		MatSlideToggleModule,
		MatFormFieldModule,
		MatInputModule,
		MatCheckboxModule,
		MatSelectModule,
		ReactiveFormsModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		ClipboardModule,
		MatProgressBarModule,
		SocketIoModule.forRoot(config),
		CodeInputModule,
		MatBadgeModule,
		MatTooltipModule
	],
	providers: [
		AuthGuardService,
		// { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
		{ provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
		ReplaceNickname,
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
