import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { userService } from 'src/app/services/user.service';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit {
	nickname:string = '';
	email:string = '';

	constructor(private UserService: userService) {
	}

	async ngOnInit() {
		await this.UserService.getUserInfo()
			.then((userInfo) => {
				this.nickname = userInfo.nickname;
				this.email = userInfo.email;
			})
			.catch((err) => {
				this.nickname = "";
				this.email = "";
			})
	}

	async onSubmit() {
		await this.UserService.updateInfo(this.nickname, this.email);
	}
}
