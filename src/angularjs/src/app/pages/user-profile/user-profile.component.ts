import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
    constructor(private userService: UserService,
                private formBuilder: FormBuilder) {}

    user: any = {
        ftLogin: "",
        nickname: "",
        picture: "",
        email: "",
        twoAuthFactor: false
    };

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

        this.userService.updateInfo(JSON.stringify(this.userForm.value))
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

