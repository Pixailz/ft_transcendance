import { Component } from '@angular/core';
import { userService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
	nickname:string = '';
	email:string = '';

	constructor(private UserService: userService) {
	}

	async onSubmit() {
		await this.UserService.updateInfo(this.nickname, this.email);
		window.location.href = '/home';
	}
}
