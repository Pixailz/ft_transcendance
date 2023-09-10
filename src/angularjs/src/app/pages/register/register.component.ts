import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { DefUserI, UserI } from 'src/app/interfaces/chat.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
	user: UserI = DefUserI;

	constructor(private userService: UserService) {
	}

	async ngOnInit() {
		this.user = await this.userService.getUserInfo();
	}

	async onSubmit() {
		await this.userService.updateInfo(this.user.nickname, this.user.email);
		window.location.href = '/home';
	}
}
