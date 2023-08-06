import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
	nickname:string = '';
	email:string = '';

	constructor(private userService: UserService) {
	}

	async ngOnInit() {
		await this.userService.getUserInfo()
			.then((user) => {
				this.nickname = user.nickname;
				this.email = user.email;
			})
			.catch((err) => {
				this.nickname = "";
				this.email = "";
			})
	}

	async onSubmit() {
		await this.userService.updateInfo(this.nickname, this.email);
	}
}
