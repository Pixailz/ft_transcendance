import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { slideInAnimation } from '../animations';
import { RouterOutlet } from '@angular/router';
import { WSGateway } from '../services/websocket/gateway';
import { ChatChannelService } from '../services/websocket/chat/channel/service';
import { FriendService } from '../services/websocket/friend/service';
import { ChatDmService } from '../services/websocket/chat/direct-message/service';
import { WSService } from '../services/websocket/service';

@Component({
	selector: 'app-authenticated-layout',
	templateUrl: './authenticated-layout.component.html',
	styleUrls: ['./authenticated-layout.component.scss'],
	animations: [ slideInAnimation ]
})
export class AuthenticatedLayoutComponent implements OnInit, OnDestroy, AfterViewInit{
	constructor(
		private changeRef: ChangeDetectorRef,
		private wsService: WSService,
		private wsGateway: WSGateway,
		
	) {
	}

	ngAfterViewInit(): void {
		this.changeRef.detectChanges();
	}

	ngOnInit()
	{
		console.log("[AUTH_LAYOUT] onInit");
		window.onbeforeunload = () => this.ngOnDestroy();
	}

	ngOnDestroy()
	{
		console.log("[AUTH_LAYOUT] onDestroy");
	}

	prepareRoute(outlet: RouterOutlet){
		return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
	}
}
