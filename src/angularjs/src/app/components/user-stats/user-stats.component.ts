import { Component, Input, OnInit } from '@angular/core';
import { DefUserI, UserI } from 'src/app/interfaces/user/user.interface';
import { BackService } from 'src/app/services/back.service';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.css']
})
export class UserStatsComponent implements OnInit {
  @Input() user: UserI;
  userInfos: any = null;
  constructor(
    private backService: BackService,
  ) {}

  ngOnInit() {
    if (!this.user){
      this.user = DefUserI;
    }
    this.backService.req("GET", "game/user-stats/" + this.user.id)
    .then((res) => {
      this.userInfos = res;
    })
    .catch((err) => {
      this.userInfos = null;
    });
  }

}
