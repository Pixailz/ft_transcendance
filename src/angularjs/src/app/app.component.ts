import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { slideInAnimation } from './animations';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	animations: [
		slideInAnimation
	]
})

export class AppComponent {
	title = 'transcendence';
	constructor(private socket: Socket) {
		this.socket.connect();
	}
}
