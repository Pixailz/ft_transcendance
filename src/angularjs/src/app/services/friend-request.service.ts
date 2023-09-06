import { Injectable } from '@angular/core';
import { BackService } from "./back.service";
import { FriendRequestI, DefFriendRequestI } from '../interfaces/chat.interface';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class FriendRequestService {

  constructor(
		private backService: BackService,
    private userService: UserService,
  ) { }

    friendRequestId: number[] = [];

    updateNewFriendReq(id: number)
    {
      for (let i = 0; i < this.friendRequestId.length; i++)
      {
        if (this.friendRequestId[i] === id)
          return;
      }
      this.friendRequestId.push(id);
    }

    updateFriendRequest(tab: number[]) {
      this.friendRequestId = tab;
    }

    async getRequest()  {
      let tmp: FriendRequestI[] = [];
      await this.backService.req("GET", "/db/friendRequest/me")
      .then((data) => {
        for (let i in data)
        {
          if (data[i].meId !== -1)
            tmp.push(data[i]);
        }
        console.log("data in get request= ", data);
        return (tmp);
      })
      .catch((err) => {
        console.log("[getFriendRequest]", err.status);
      })
      return (tmp);
    }

    async acceptRequest(friend_id: number) {
      await this.backService.req("DELETE", "/db/friendRequest/accept/" + friend_id);
    }

    async declineRequest(friend_id: number) {
      await this.backService.req("DELETE", "/db/friendRequest/decline/" + friend_id);
    }

    async alreadyFriend(friend_id: number) : Promise<boolean> {
      const already = await this.backService.req("GET", "/db/friend//alreadyFriend/" + friend_id)
      if (already)
        return (true);
      return (false);
    }
}