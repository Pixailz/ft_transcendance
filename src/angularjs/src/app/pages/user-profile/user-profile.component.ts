import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { DefUserI, UserI } from 'src/app/interfaces/chat.interface';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
	constructor(private userService: UserService,
				private formBuilder: FormBuilder) {}

	user: UserI = DefUserI;
	userForm!: FormGroup;

	async ngOnInit() {
		this.user = await this.userService.getUserInfo();
		this.userForm = this.formBuilder.group({
			login: this.user.ftLogin,
			nickname: this.user.nickname,
			picture: this.user.picture,
			email: this.user.email,
			twofa: this.user.twoAuthFactor
		});
		this.userForm.get('login')?.disable();
	}

	async onSubmit() {
		this.userForm.patchValue({
			login: this.user.ftLogin
		});

		Object.keys(this.userForm.value).forEach(key => {
			if (this.userForm.value[key] === "") {
				delete this.userForm.value[key];
			}
		});
		await this.userService.updateInfo(
			this.userForm.value.nickname,
			this.userForm.value.email
		)
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	}
}

