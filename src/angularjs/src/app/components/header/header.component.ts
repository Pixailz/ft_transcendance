import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
	userLoggedIn = false;

	async ngOnInit() {
		if (localStorage.getItem("access_token"))
			this.userLoggedIn = true;
		else
			this.userLoggedIn = false;
	}

	SignOut()
	{
		localStorage.removeItem("access_token");
		this.userLoggedIn = false;
	}
}
