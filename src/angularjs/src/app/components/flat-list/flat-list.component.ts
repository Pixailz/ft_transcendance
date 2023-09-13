import { Component, Input } from '@angular/core';
import { UserI } from 'src/app/interfaces/user/user.interface';
import { FriendService } from 'src/app/services/websocket/friend/service';
import { UserService } from 'src/app/services/user.service';

@Component({
	selector: 'app-flat-list',
	templateUrl: './flat-list.component.html',
	styleUrls: ['./flat-list.component.scss']
})

export class FlatListComponent {
	@Input() friends: UserI[]= [];

	constructor (
		public friendService: FriendService,
		public userService: UserService,
	) {}
}
