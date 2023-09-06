import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { WSGateway } from 'src/app/services/ws.gateway';
import { FriendRequestService } from 'src/app/services/friend-request.service';

@Component({
   animations: [
    trigger(
      'enterAnimation', [

		transition('void <=> *', animate(0)),

        transition(':enter', [
          style({transform: 'translateX(100%)'}),
          animate('300ms', style({transform: 'translateX(0)'}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)'}),
          animate('300ms', style({transform: 'translateX(100%)'}))
        ])
      ]
    )
  ],
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})

  export class NotificationComponent implements OnInit {
    constructor (
        private renderer: Renderer2,
        private wsGateway: WSGateway,
        private friendRequestService: FriendRequestService
    ) {}

    ngOnInit() {

        this.wsGateway.listenNotification()
        .subscribe(async (message: string) => {
          this.displayNotification(message);
        });
    }
    displayNotification(message: string) {
      const container = document.getElementById('container');
      const elem = this.renderer.createElement('div');
      const text = this.renderer.createText(message);
      this.renderer.appendChild(elem, text);
      this.renderer.addClass(elem, 'notification');
      this.renderer.appendChild(container, elem);
      setTimeout(() => {
        this.renderer.removeChild(container, elem);
      }, 5000);
    }

  }