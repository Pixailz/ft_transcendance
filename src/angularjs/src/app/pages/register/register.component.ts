import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { DefUserI, UserI } from 'src/app/interfaces/user/user.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
	constructor(public userService: UserService) {
	}

	async ngOnInit() {
		this.userService.user = await this.userService.getUserInfo();
	}

	async onSubmit() {
		await this.userService.updateInfo(this.userService.user.nickname, this.userService.user.email);
		window.location.href = '/home';
	}
}
