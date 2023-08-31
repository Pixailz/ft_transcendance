import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DefUserI, UserI } from 'src/app/interfaces/chat.interface';
import { BackService } from 'src/app/services/back.service';
import { WSGateway } from 'src/app/services/ws.gateway';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
	user_info: UserI = DefUserI;

	constructor(
		private route: ActivatedRoute,
		private back: BackService,
		private wsGateway: WSGateway,
	) {}

	ngOnInit(): void {
		this.route.params.subscribe(params => {
			this.back.req("GET", "/user/profile/" + params['login'])
				.then((data) => {
					this.user_info = data;
				})
				.catch((err) => {
					console.log("[profile]", err.status);
				})
		});
		this.wsGateway.connection();
	}
}
