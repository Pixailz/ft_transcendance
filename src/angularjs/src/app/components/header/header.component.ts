import { Component } from '@angular/core';
import { userService } from '../../services/user.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
	constructor(
		private UserService: userService,
	) {}
	userLoggedIn = false;

	async ngOnInit()
	{ this.userLoggedIn = this.UserService.isLoggedIn(); }

	SignOut()
	{ this.UserService.SignOut(); }

}
