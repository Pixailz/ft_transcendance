import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DefFriendRequestI, DefUserI, FriendRequestI, UserI } from 'src/app/interfaces/chat.interface';
import { FriendRequestService } from 'src/app/services/friend-request.service';
import { UserService } from 'src/app/services/user.service';
import { WSGateway } from 'src/app/services/ws.gateway';

@Component({
  selector: 'app-flat-list',
  templateUrl: './flat-list.component.html',
  styleUrls: ['./flat-list.component.scss']
})

export class FlatListComponent implements OnInit, OnChanges {
  @Input() friendsId: number[] = [];
  @Input() newId: number = -1;
  
  friends: UserI[]= []; 

  constructor (
    public userService: UserService,
    public friendRequestService: FriendRequestService,
  ) {}
  
  async ngOnInit() {
    for (let i = 0; i < this.friendsId.length; i++)
      this.friends.push(await this.userService.getUserInfoById(this.friendsId[i]));
  }

  async ngOnChanges(changes: SimpleChanges) {
	if (this.newId !== -1)
	{
    for (let i = 0; i < this.friendsId.length; i++)
			if (this.friendsId[i] === this.newId)
        return ;
    this.friends.push(await this.userService.getUserInfoById(this.newId));
    }
  }
}
