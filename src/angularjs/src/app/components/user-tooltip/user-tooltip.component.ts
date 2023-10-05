import { Component, Input } from '@angular/core';
import { UserI } from 'src/app/interfaces/user.interface';
import { FriendService } from 'src/app/services/websocket/friend/service';
import { WSGateway } from 'src/app/services/websocket/gateway';

@Component({
  selector: 'app-user-tooltip',
  templateUrl: './user-tooltip.component.html',
  styleUrls: ['./user-tooltip.component.scss']
})
export class UserTooltipComponent {
  @Input() user!: UserI;

  constructor(
    public friendService: FriendService,
		private wsGateway: WSGateway,
  ) {}

  doAction() {
    if (this.friendService.isTargetBlocked(this.user.id)) {
      this.wsGateway.unblockUser(this.user.id);
    } else {
      this.wsGateway.blockUser(this.user.id);
    }
  }
}
