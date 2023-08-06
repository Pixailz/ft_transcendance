import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
	constructor(
		private userService: UserService,
	) {}
	userLoggedIn = false;

	async ngOnInit()
	{ this.userLoggedIn = this.userService.isLoggedIn(); }

	SignOut()
	{ this.userService.SignOut(); }

}
