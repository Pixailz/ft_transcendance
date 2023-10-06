import { Component, Directive, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { DefUserI, UserI } from 'src/app/interfaces/user/user.interface';
import { MatDialog } from '@angular/material/dialog';
import { TwofaformComponent } from 'src/app/components/twofaform/twofaform.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { pairwise } from 'rxjs';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss'],
	animations: [trigger("enterInvalidNickname", [
		transition(':enter', [
			style({transform: 'translateX(-50%) scale(0)'}),
			animate('500ms ease-out',
				style({transform: 'translateX(-50%) scale(1)'})
			),
		]),
	])]

})
export class UserProfileComponent implements OnInit {
	constructor(
		private userService: UserService,
		private formBuilder: FormBuilder,
		public dialog: MatDialog,
		)
		{}

	math: Math = Math;
	user: UserI = DefUserI;
	userForm!: FormGroup;
	submitted: boolean = true;
	invalidNickname: string = "";
	nbMissingChar!: number;

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
		.subscribe((value: any) => {
			value.nickname = value.nickname.replace(/ /g, '');
			value.nickname = value.nickname.replace(/	/g, '');
			this.userForm.patchValue({
				nickname: value.nickname,
			}, {emitEvent: false, onlySelf: true});
			this.nbMissingChar = 3 - value.nickname.length;
			if (this.submitted)
				this.submitted = false;
			if (this.invalidNickname)
				this.invalidNickname = "";
		});
	}

	async onSubmit() {
		this.userForm.patchValue({
			login: this.user.ftLogin,
		});

		Object.keys(this.userForm.value).forEach(key => {
			if (this.userForm.value[key] === "") {
				delete this.userForm.value[key];
			}
		});
		await this.userService.updateProfile(this.userForm.value)
			.then((res) => {
				console.log(res);
				this.userForm.patchValue({
					nickname: this.userForm.value.nickname,
				})
				this.submitted = true;
				this.user.nickname = this.userForm.value.nickname;
			})
			.catch((err) => {
				if (err.status == 409)
					this.invalidNickname = "Nickname already taken";
				else if (err.status == 400)
					this.invalidNickname = "Invalid nickname";
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
