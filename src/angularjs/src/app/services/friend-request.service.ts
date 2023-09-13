import { Injectable } from '@angular/core';
import { BackService } from "./back.service";
import { UserI, DefUserI } from '../interfaces/user/user.interface';
import { FriendRequestI } from '../interfaces/user/friend.interface';
import { UserService } from './user.service';
import { WSGateway } from './ws.gateway';
import { FriendReqStatus } from '../pages/profile/profile.component';

@Injectable({
  providedIn: 'root'
})
export class FriendRequestService {

  constructor(
		private backService: BackService,
    private userService: UserService,
    private wsGateway: WSGateway,
  ) { }

    friends: UserI [] = [ DefUserI ];

    async updateNewFriendReq(id: number)
    {
      for (let i = 0; i < this.friends.length; i++)
      {
        if (this.friends[i].id === id)
          return;
      }
      const user = await this.userService.getUserInfoById(id);
      this.friends.push(user);
    }

    async updateFriendRequest(tab: number[]) {
      this.friends = [];
      for (let i = 0; i < tab.length; i++)
        this.friends.push(await this.userService.getUserInfoById(tab[i]));
    }

    removeFriendReq(id: number)
    {
      for (let i = 0; i < this.friends.length; i++)
        this.friends.splice(i, 1);
    }

    async getRequest()  {
      let tmp: FriendRequestI[] = [];
      await this.backService.req("GET", "/db/friendRequest/me")
      .then((data) => {
        for (let i in data)
          if (data[i].meId !== -1)
            tmp.push(data[i]);
        return (tmp);
      })
      .catch((err) => {
        console.log('[GetFriendRequest] ', err);
      })
      return (tmp);
    }

    async acceptRequest(friend_id: number) {
        this.wsGateway.acceptFriendReq(friend_id);
    }

    async rejectFriendReq(friend_id: number) {
      this.wsGateway.rejectFriendReq(friend_id);
    }

    async alreadyFriend(friend_id: number) : Promise<boolean> {
      const already = await this.backService.req("GET", "/db/friend/alreadyFriend/" + friend_id)
      if (already)
        return (true);
      return (false);
    }

    async alreadySend(friend_id: number) {
      const already = await this.backService.req("GET", "/db/friendRequest/sent/" + friend_id);
      if (already)
        return (FriendReqStatus.SENT);
      return (FriendReqStatus.NOTSENT);
    }

}