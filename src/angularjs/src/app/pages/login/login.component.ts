import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TwofaformComponent } from 'src/app/components/twofaform/twofaform.component';

import { environment } from 'src/app/environments/environment';
import { UserService } from 'src/app/services/user.service';

import { ReplaceNickname } from 'src/utils/utils';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {
	code: string | null = null;
	response: any = null;
	state: any = null;
	isButtonClickable: boolean = true;

	loginForm!: FormGroup;
	failedMessage: string = "";
	moulining: boolean = false;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private http: HttpClient,
		private userService: UserService,
		private formBuilder: FormBuilder,
		private replaceNickname: ReplaceNickname,
		public dialog: MatDialog
	) {
		this.loginForm = this.formBuilder.group({
			nickname: '',
			pass: '',
			show_pass: false,
			login: true,
		}), {updateOn: "change"};
		this.loginForm?.valueChanges.subscribe((value: any) => {
			if (this.loginForm.value.nickname !== null)
			{
				value.nickname = this.replaceNickname.replace_nickname(value.nickname);
				this.loginForm.patchValue({
					nickname: value.nickname,
				}, {emitEvent: false, onlySelf: true});
			}
		})
	}

	get passwordInputType() {
		return this.loginForm.value.show_pass ? 'text' : 'password';
	}

	toggle() {
		this.loginForm.patchValue({
			show_pass: !this.loginForm.value.show_pass
		});
	}

	async ngOnInit() {
		if (await this.userService.checkToken()) this.router.navigate(['/']);
		this.code = this.route.snapshot.queryParamMap.get('code');
		this.state = this.route.snapshot.queryParamMap.get('state');

		if (this.state !== null) {
			try {
				this.state = JSON.parse(atob(this.state));
			} catch (e) {
				console.log(e);
				this.state = null;
			}
		}
		if (this.code !== null) {
			await this.getToken();
			this.router.navigate([this.state?.redirect || '/']);
		}
	}

	async handleToken(): Promise<void> {
		if (!this.response || (this.response.access_token === undefined && this.response.status === undefined)) {
			console.log('Error: ' + this.response);
			return;
		}
		if (this.response.status && this.response.status == "2fa"){
			this.handle2FA();
		}
		localStorage.setItem('access_token', this.response.access_token);
		if (this.response.status == "register") {
			this.router.navigate(['/register']);
		} else {
			this.state?.redirect ? this.router.navigate([this.state.redirect]) : this.router.navigate(['/']);
		}
	}

	handle2FA(): void {
		console.log(this.response);
		const dialogRef = this.dialog.open(TwofaformComponent, {
			data: {
					notice: "Please enter the code from your authenticator app",
					nonce: this.response.nonce,
					returnUrl: this.state?.redirect,
			},
			panelClass: 'custom-dialog',
			closeOnNavigation: false,
			disableClose: true
		});
		console.log(dialogRef)
		dialogRef.afterClosed().subscribe((result) => {
			if (result && result.status == "oke") {
				this.response = result;
				this.handleToken();
			}
		})
	}

	async getToken(): Promise<void> {
		this.isButtonClickable = false;
		this.moulining = true;

		try {
			this.response = await this.http
				.get(environment.api_prefix + '/auth/ft_callback?code=' + this.code)
				.toPromise();
			await this.handleToken();
		} catch (err) {
			this.moulining = false;
			const message = document.getElementById('message');
			if (message) message.innerHTML = 'Error: ' + err.error.message;
		}
	}

	SignIn()
	{
		window.location.href = environment.after_auth_uri
			+'&state='
			+btoa(JSON.stringify({redirect: this.route.snapshot.queryParamMap.get('returnUrl')}))
	};

	async doAction()
	{
		this.moulining = true;
		if (this.loginForm.value.login)
			await this.SignInExt()
		else
			await this.RegisterExt()
		this.moulining = false;
		this.loginForm.reset({
			nickname: undefined,
			pass: undefined,
			show_pass: false,
			login: true,
		})
	}

	private async sendAuthRequest(url: string, nickname: string, password: string): Promise<void> {
		try {
			this.response = await this.http
				.get(url + '?nickname=' + nickname + '&pass=' + password)
				.toPromise();
			if (this.response.status === 401)
				this.failedMessage = this.response.message;
			await this.handleToken();
		} catch (err) {
			const message = document.getElementById('message');
			if (message) message.innerHTML = 'Error: ' + err.error;
		}
	}

	async SignInExt(): Promise<void> {
		await this.sendAuthRequest(
			environment.api_prefix + '/auth/ext_login',
			this.loginForm.value.nickname,
			this.loginForm.value.pass
		);
	}

	async RegisterExt(): Promise<void> {
		await this.sendAuthRequest(
			environment.api_prefix + '/auth/ext_register',
			this.loginForm.value.nickname,
			this.loginForm.value.pass
		);
	}
}
