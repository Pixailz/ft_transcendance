import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { DefUserI, UserI } from 'src/app/interfaces/user.interface';
import { NotificationService } from 'src/app/services/websocket/notification/service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { animate, animateChild, query, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
		trigger('enterAnimation', [
			transition('void => *', [
				style({transform: 'scale(0)'}),
				animate('300ms ease-in-out',
					style({transform: 'scale(1)'})
				),
				query('@*', animateChild(), {optional: true})]),
			transition('* => void', [
				style({transform: 'scale(1)'}),
				animate('300ms ease-in-out',
					style({transform: 'scale(0)'})
				),
				query('@*', animateChild(), {optional: true})])]),
		trigger('input', [
			transition('void => *', [
				style({width: '50px', padding: '4px', color: 'transparent'}),
				animate('500ms cubic-bezier(.86,1.73,.75,.46)',
					style({width: '300px', padding: '4px 70px 4px 20px', color: 'white'})),
			]),
			transition('* => void', [
				style({width: '300px', padding: '4px 70px 4px 20px', color: 'white'}),
				animate('500ms cubic-bezier(.86,1.73,.75,.46)',
				style({width: '50px', padding: '4px', color: 'transparent'})),
			])
		])
  ]
})
export class RegisterComponent {
	constructor(
		public userService: UserService,
		private formBuilder: FormBuilder,
	)
	{}

	userForm!: FormGroup;

	async ngOnInit() {
		this.userService.user = await this.userService.getUserInfo();

		this.userForm = this.formBuilder.group({
			nickname: { value: this.userService.user.nickname }
		}, { updateOn: "change" });
		const control = new FormControl('ng', Validators.minLength(3));

	}

	async onSubmit() {
		await this.userService.updateInfo(this.userService.user.nickname)
			.catch((err) => {
				console.log(err);
			});
		window.location.href = '/home';
	}
}
