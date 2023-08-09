import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
	user: any;

	constructor(private userService: UserService) {
	}

	async ngOnInit() {
		this.user = await this.userService.getUserInfo();
	}

	async onSubmit() {
		await this.userService.updateInfo(this.user);
		window.location.href = '/home';
	}
}
