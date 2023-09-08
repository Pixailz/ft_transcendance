import { Component, Input } from '@angular/core';
import { UserI } from 'src/app/interfaces/user.interface';
import { FriendRequestService } from 'src/app/services/friend-request.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-flat-list',
  templateUrl: './flat-list.component.html',
  styleUrls: ['./flat-list.component.scss']
})

export class FlatListComponent {
  @Input() friends: UserI[]= [];

  constructor (
    public userService: UserService,
    public friendRequestService: FriendRequestService,
  ) {}
}
