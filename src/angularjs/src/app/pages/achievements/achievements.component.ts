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
  nickname: string = "";
  constructor(
	private route: ActivatedRoute,
	private back: BackService
  ) {}

  async ngOnInit() {
	this.nickname = this.route.snapshot.paramMap.get("nickname");
	this.achievements = await this.back.req("GET",
		"/user/achievements/" + this.nickname)
		.catch((err) => {
			console.log("[profile]", err.status);
		});
	if (!this.achievements || this.subscription) return;
	this.subscription = this.route.params.subscribe(params => {
		if (params['nickname'] != this.nickname){
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
