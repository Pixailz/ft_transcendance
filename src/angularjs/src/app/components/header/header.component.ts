import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { userService } from '../../services/user.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
	constructor(
		private router: Router,
		private UserService: userService,
	) {}
	userLoggedIn = false;

	async ngOnInit()
	{ this.userLoggedIn = this.UserService.isLoggedIn(); }

	SignOut()
	{ this.UserService.SignOut(); }

}
