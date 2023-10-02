import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { animate, animateChild, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { pairwise } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
		trigger('enterAnimation', [
			state('closed', style({transform: 'scale(1)'})),
			transition(':enter', [
				style({transform: 'scale(0)'}),
				animate('300ms ease-in-out',
					style({transform: 'scale(1)'})
				),
				query('@*', animateChild(), {optional: true})
			]),
			transition('* => closed', [
				animate('300ms  ease-in-out'),
				query('@*', animateChild(), {optional: true})
			])
		]),
		trigger('input', [
			state('closed', style({width: '50px', padding: '4px', color: 'transparent'})),
			transition('void => *', [
				style({width: '50px', padding: '4px', color: 'transparent'}),
				animate('500ms ease-out',
					style({width: '300px', padding: '4px 70px 4px 20px', color: 'white'})),
			]),
			transition('* => closed', [
				animate('500ms ease-out'),
			])
		]),
		trigger('button', [
			state('closed', style({transform: 'rotate(-360deg)'})),
			transition(':enter', [
				style({transform: 'none'}),
				animate('500ms ease-out',
					style({transform: 'rotate(360deg)'})
				),
			]),
			transition('* => closed', [
				animate('500ms ease-out'),
			])
		])
  ]
})
export class RegisterComponent {
	constructor(
		public userService: UserService,
		private formBuilder: FormBuilder,
		private router: Router,
	)
	{}

	submitted: boolean = false;
	userForm!: FormGroup;
	invalidNickname: string = "";
	error: boolean = false;

	async ngOnInit() {
		this.userService.user = await this.userService.getUserInfo();
		if (this.userService.user.nickname.length)
			this.router.navigate(['/']);
		this.userForm = this.formBuilder.group({
			nickname: { value: this.userService.user.nickname }
		}, { updateOn: "change" });

		this.userForm.get('nickname')?.valueChanges
		.pipe(pairwise())
		.subscribe(([prev, next]: [any, any]) => {
			this.error = false;
		});
	}

	async onSubmit() {
		this.userService.updateInfo(this.userService.user.nickname)
		.then(() => {
			this.submitted = true;
			setTimeout(() => {
				window.location.href = '/home';
			}, 800);
		})
		.catch((err) => {
			this.error = true;
			if (err?.status == 400)
				this.invalidNickname = "Invalid nickname";
			else if (err?.status == 409)
				this.invalidNickname = "Nickname already taken";
		})
	}
}
