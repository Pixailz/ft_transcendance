import { Component } from '@angular/core';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
	public ft_login: string = 'ft_login';
	public twofa: boolean = false;
	public userLoggedIn: boolean = false;
}
