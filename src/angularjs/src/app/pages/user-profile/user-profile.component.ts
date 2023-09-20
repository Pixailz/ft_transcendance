import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { DefUserI, UserI } from 'src/app/interfaces/user.interface';
import { MatDialog } from '@angular/material/dialog';
import { TwofaformComponent } from 'src/app/components/twofaform/twofaform.component';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
	constructor(
		private userService: UserService,
		private formBuilder: FormBuilder,
		public dialog: MatDialog
	)
	{}

	user: UserI = DefUserI;
	userForm!: FormGroup;
	submitted: boolean = true;
	invalidNickname: boolean = false;


	async ngOnInit() {
		this.user = await this.userService.getUserInfo();
		this.userForm = this.formBuilder.group({
			login: { value: this.user.ftLogin, disabled: true },
			nickname: this.user.nickname,
			picture: this.user.picture,
			email: this.user.email,
			twofa: this.user.twoAuthFactor,
		}, { updateOn: "change" });
		this.userForm.valueChanges
		.subscribe((values) => {
			if (this.submitted)
				this.submitted = false;
			if (this.invalidNickname)
				this.invalidNickname = false;
		});
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
		await this.userService.updateProfile(this.userForm.value)
			.then((res) => {
				console.log(res);
				this.submitted = true;
			})
			.catch((err) => {
				this.invalidNickname = true;
				console.log(err);
			});
	}

	async setupTwoFa() {
		if (this.userForm.value.twofa)
		{
			await this.userService.disableTwoFa()
			.catch((err: any) => {
				console.log(err);
			})
			.then(() => {
				this.userForm.patchValue({ twofa: false });
			});
		}
		else
		{
			await this.userService
			.setupTwoFa()
			.then(async (res) => {
				this.dialog.open(TwofaformComponent, {
					data: {
						qrCode: res.qrCodeDataURL,
						notice: "Scan this QR code with your app, then enter the code below",
						nonce: await this.userService.getNonce()
					},
					panelClass: 'custom-dialog'
				})
				.afterClosed().subscribe((res) => {
					if (res !== undefined && res.status === 'oke')
					{
						this.userForm.patchValue({
							twofa: true
						});
					}
					else {
						const checkbox = document.getElementById('twofa') as HTMLInputElement;
						checkbox.checked = false;
					}
				});
			})
			.catch((err: any) => {
				console.log(err);
			});
		}
	}
}
