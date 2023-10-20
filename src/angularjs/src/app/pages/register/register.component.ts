import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { registerPopInput, registerSlideInput, resgisterRotateBtn } from 'src/app/animations';

import { ReplaceNickname } from 'src/utils/utils';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
		registerPopInput,
		registerSlideInput,
		resgisterRotateBtn,
  ]
})
export class RegisterComponent {
	constructor(
		public userService: UserService,
		private formBuilder: FormBuilder,
		private router: Router,
    private replaceNickname: ReplaceNickname,
	)
	{}

	submitted: boolean = false;
	userForm!: FormGroup;
	invalidNickname: string = "";
	error: boolean = false;
	nbMissingChar!: number;


	async ngOnInit() {
		this.userService.user = await this.userService.getUserInfo();
		if (this.userService.user.nickname.length)
			this.router.navigate(['/']);
		this.userForm = this.formBuilder.group({
			nickname: { value: this.userService.user.nickname }
		}, { updateOn: "change" });

		this.userForm.valueChanges
		.subscribe((value: any) => {
      value.nickname = this.replaceNickname.replace_nickname(value.nickname);
			this.userForm.patchValue({
				nickname: value.nickname,
			}, {emitEvent: false, onlySelf: true});
			this.nbMissingChar = 3 - value.nickname.length;
			if (this.submitted)
				this.submitted = false;
			if (this.invalidNickname)
				this.invalidNickname = "";
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


/*
html:
<svg class="numbers" viewBox="0 0 100 100">
  <path class="numbers-path"
        d="M-10,20 60,20 40,50 a18,15 0 1,1 -12,19
           Q25,44 34.4,27.4
           l7,-7 a16,16 0 0,1 22.6,22.6 l-30,30 l35,0 L69,73
           a20,10 0 0,1 20,10 a17,17 0 0,1 -34,0 L55,83
           l0,-61 L40,28" />
</svg>

css:
$numSize: 100px;
$totalAT: 4s;

$num1Len: 72.1554946899414;
$num2Len: 136.02162170410156;
$num3Len: 144.4256591796875;
$numJoin1-2: 82.63925170898438;
$numJoin2-3: 42.81303787231445;
$numJoin3-0: 40;

$totalLen: $num1Len + $num2Len + $num3Len + $numJoin1-2 + $numJoin2-3 + $numJoin3-0;

body {
  background: red;
  font-family: Helvetica, Arial, sans-serif;
}
  .numbers {
    overflow: visible;
    position: absolute;
    left: 50%;
    top: 50%;
    width: $numSize;
    height: $numSize;
    margin-left: $numSize/-2;
    margin-top: $numSize/-2;

    &-path {
      fill: none;
      stroke-width: 10px;
      stroke: #fff;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 0, $totalLen;
      stroke-dashoffset: 0;
      animation: numAnim $totalAT ease-in-out infinite;
      opacity: 0;
    }
  }

//
@keyframes numAnim {
  15% {
    stroke-dasharray: 0, $totalLen;
    stroke-dashoffset: 0;
    opacity: 0;
    stroke: yellow;
  }
  25%, 41% {
    opacity: 1;
    stroke-dasharray: $num3Len, $totalLen;
    stroke-dashoffset: -$numJoin3-0;
    stroke: blue;
  }
  53%, 66% {
    stroke-dasharray: $num2Len, $totalLen;
    stroke-dashoffset: -$num3Len - $numJoin2-3 -$numJoin3-0;
    stroke: green;

  }
  76%, 100% {
    stroke-dasharray: $num1Len, $totalLen;
    stroke-dashoffset: -$num3Len - $numJoin2-3 - $num2Len - $numJoin1-2 -$numJoin3-0;
    stroke: black;

  }
}
//
3:
	stroke-dasharray: $num3Len, $totalLen;
	stroke-dashoffset: -$numJoin3-0;

2:
    stroke-dasharray: $num2Len, $totalLen;
    stroke-dashoffset: -$num3Len - $numJoin2-3

1:
    stroke-dasharray: $num1Len + $numJoin1-2/2, $totalLen;
    stroke-dashoffset: -$num3Len - $numJoin2-3 - $num2Len - $numJoin1-2 -$numJoin3-0;

*-3:
    stroke-dasharray: 0, $totalLen;
    stroke-dashoffset: 0;
*/
