import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { DefUserI, UserI } from 'src/app/interfaces/chat.interface';
import { MatDialog } from '@angular/material/dialog';
import { TwofaformComponent } from 'src/app/components/twofaform/twofaform.component';
import { DialogRef } from '@angular/cdk/dialog';
import { BackService } from 'src/app/services/back.service';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
	constructor(
		private userService: UserService,
		private formBuilder: FormBuilder,
		private back: BackService,
		public dialog: MatDialog
	)
	{}

	user: UserI = DefUserI;
	userForm!: FormGroup;

	async ngOnInit() {
		this.user = await this.userService.getUserInfo();
		this.userForm = this.formBuilder.group({
			login: { value: this.user.ftLogin, disabled: true },
			nickname: this.user.nickname,
			picture: this.user.picture,
			email: this.user.email,
			twofa: this.user.twoAuthFactor,
		}, { updateOn: "change" });
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
			})
			.catch((err) => {
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