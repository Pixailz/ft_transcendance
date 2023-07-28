import { Component } from '@angular/core';
import { authGuardService } from 'src/app/auth-guard.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
	userLoggedIn = false;

	async ngOnInit() {
		this.userLoggedIn = await authGuardService();
	}

	SignOut()
	{
		localStorage.removeItem("access_token");
		this.userLoggedIn = false;
	}
}
