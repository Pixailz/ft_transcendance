import { Component, OnInit, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { WSGateway } from 'src/app/services/ws.gateway';

@Component({
	selector: 'app-home-dashboard',
	templateUrl: './home-dashboard.component.html',
	styleUrls: ['./home-dashboard.component.scss']
})
export class HomeDashboardComponent implements OnInit{
	constructor (private wsGateway: WSGateway) {
	}
	private breakpointObserver = inject(BreakpointObserver);

	/** Based on the screen size, switch from standard to one column per row */
	cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
		map(({ matches }) => {
			if (matches) {
				return [
				{ title: 'LeaderBoard', cols: 1, rows: 1 },
				{ title: 'Global Chatroom', cols: 1, rows: 1 },
				{ title: 'Online Users', cols: 1, rows: 1 },
				{ title: 'Private Chatrooms', cols: 1, rows: 1 }
				];
			}

			return [
				{ title: 'LeaderBoard', cols: 2, rows: 1 },
				{ title: 'Global Chatroom', cols: 1, rows: 1 },
				{ title: 'Private Chatrooms', cols: 1, rows: 2 },
				{ title: 'Online Users', cols: 1, rows: 1 }
			];
		})
	);

	ngOnInit() {
		this.wsGateway.connection();
	}
}
