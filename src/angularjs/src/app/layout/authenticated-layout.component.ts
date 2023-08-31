import { Component } from '@angular/core';
import { slideInAnimation } from '../animations';
import { WSGateway } from '../services/ws.gateway';

@Component({
	selector: 'app-authenticated-layout',
	templateUrl: './authenticated-layout.component.html',
	styleUrls: ['./authenticated-layout.component.scss'],
	animations: [ slideInAnimation ]
})
export class AuthenticatedLayoutComponent {
	constructor (
		private wsGateway: WSGateway,
	) {}

	ngOnInit ()
	{
		this.wsGateway.socket.connect();
	}
}
