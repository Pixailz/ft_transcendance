import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { HomeDashboardComponent } from './pages/home-dashboard/home-dashboard.component';
import { PongComponent } from './pages/pong/pong.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { WSChatComponent } from './pages/chat/chat.component';
import { AuthGuardService } from './services/auth-guard.service';
import { environment } from './environments/environment';

const config: SocketIoConfig = {
	url: environment.socket_url,
	options: {
		path: "/ws/chat",
		extraHeaders: {
			Authorization: localStorage.getItem("access_token") as string
		}
	}
};

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		FooterComponent,
		HomeDashboardComponent,
		PongComponent,
		PageNotFoundComponent,
		UserProfileComponent,
		AvatarComponent,
		LoginComponent,
		RegisterComponent,
		WSChatComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		MatGridListModule,
		MatCardModule,
		MatMenuModule,
		MatIconModule,
		MatButtonModule,
		MatToolbarModule,
		MatSlideToggleModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		SocketIoModule.forRoot(config)
	],
	providers: [AuthGuardService],
	bootstrap: [AppComponent]
})
export class AppModule { }
