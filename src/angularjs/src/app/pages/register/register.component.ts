import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
	nickname:string = '';
	email:string = '';

	constructor(private userService: UserService) {
	}

	async onSubmit() {
		await this.userService.updateInfo(this.nickname, this.email);
		window.location.href = '/home';
	}
}
