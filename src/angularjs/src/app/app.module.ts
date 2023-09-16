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
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { CodeInputModule } from 'angular-code-input';
import { Client } from 'colyseus.js';
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
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { TwofaformComponent } from './components/twofaform/twofaform.component';
import { CustomReuseStrategy } from './reuse-strategy';
import { MatBadgeModule } from '@angular/material/badge';

// WEBSOCKET
import { WSChatDmComponent } from './pages/chat-dm/chat-dm.component';
import { WSChatChannelComponent } from './pages/chat-channel/chat-channel.component';
import { GlobalErrorHandlerService } from './services/global-error-handler.service';
import { environment } from './environments/environment';
import { GameComponent } from './pages/game/game.component';
import { GameLobbyComponent } from './components/game-lobby/game-lobby.component';
import { GameRoomComponent } from './components/game-room/game-room.component';
import { GameOverComponent } from './components/game-over/game-over.component';
import { TextNotificationComponent } from './components/text-notification/text-notification.component';
import { NotifFriendReqReceivedComponent } from './components/notification/friend-req-received/friend-req-received.component';
import { NotifFriendReqSentComponent } from './components/notification/friend-req-sent/friend-req-sent.component';
import { NotifFriendReqAcceptedComponent } from './components/notification/friend-req-accepted/friend-req-accepted.component';
import { NotifFriendReqDeniedFromComponent } from './components/notification/friend-req-denied-from/friend-req-denied-from.component';
import { NotifFriendReqDeniedToComponent } from './components/notification/friend-req-denied-to/friend-req-denied-to.component';
import { GameWaitingComponent } from './components/game/waiting/waiting.component';
import { GameStartedComponent } from './components/game/started/started.component';

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
        AvatarComponent,
		GameComponent,
        GameLobbyComponent,
        GameRoomComponent,
        GameOverComponent,
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
        WSChatDmComponent,
        WSChatChannelComponent,
		NotifFriendReqSentComponent,
		NotifFriendReqReceivedComponent,
		NotifFriendReqAcceptedComponent,
		NotifFriendReqDeniedFromComponent,
		NotifFriendReqDeniedToComponent,
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
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        MatProgressBarModule,
        SocketIoModule.forRoot(config),
        CodeInputModule,
		MatBadgeModule
    ],
    providers: [
        AuthGuardService,
        { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
        { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
		Client,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

