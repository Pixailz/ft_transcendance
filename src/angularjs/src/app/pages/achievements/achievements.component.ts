import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackService } from 'src/app/services/back.service';

@Component({
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent {
  subscription: any = null;
  achievements: any = null;
  login: string = "";
  constructor(
	private route: ActivatedRoute,
	private back: BackService
  ) {}

  async ngOnInit() {
	this.login = this.route.snapshot.paramMap.get("login");
	this.achievements = await this.back.req("GET",
		"/user/achievements/" + this.login)
		.catch((err) => {
			console.log("[profile]", err.status);
		});
	if (!this.achievements || this.subscription) return;
	this.subscription = this.route.params.subscribe(params => {
		if (params['login'] != this.login){
			this.ngOnInit();
		}
	});
  }

  ngOnDestroy() {
	if (this.subscription) {
		this.subscription.unsubscribe();
		this.subscription = null;
		}
	}
}
