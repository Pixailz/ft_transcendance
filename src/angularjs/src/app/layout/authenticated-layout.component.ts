import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { slideInAnimation } from '../animations';
import { RouterOutlet } from '@angular/router';
import { WSGateway } from '../services/WebSocket/gateway';
import { ChatChannelService } from '../services/WebSocket/Chat/Channel/service';
import { FriendService } from '../services/WebSocket/Friend/service';
import { ChatDmService } from '../services/WebSocket/Chat/DirectMessage/service';

@Component({
	selector: 'app-authenticated-layout',
	templateUrl: './authenticated-layout.component.html',
	styleUrls: ['./authenticated-layout.component.scss'],
	animations: [ slideInAnimation ]
})
export class AuthenticatedLayoutComponent implements AfterViewInit{
	constructor(
		private changeRef: ChangeDetectorRef,
		private wsGateway: WSGateway,
		private chatChannelService: ChatChannelService,
		private chatDmService: ChatDmService,
		private friendService: FriendService,
	) {}

	ngAfterViewInit(): void {
		this.changeRef.detectChanges();
	}

	ngOnInit() {
		this.wsGateway.socket.connect();
		this.chatChannelService.ngOnInit();
		this.chatDmService.ngOnInit();
		this.friendService.ngOnInit();
	}

	prepareRoute(outlet: RouterOutlet){
		return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
	}
}
