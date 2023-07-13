import { Component } from '@angular/core';
import { AuthService } from '../../../../projects/auth/src/lib/auth.service';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  constructor() { }
  public userGuard: AuthService = new AuthService();
	public userLoggedIn: boolean = false;
  public user = null;

  ngOnInit(): void {
    this.userLoggedIn = this.userGuard.isAuthenticated();
    if (this.userLoggedIn) {
      this.user = this.userGuard.getUser();
    }
    else
      this.user = null;
  }
}
